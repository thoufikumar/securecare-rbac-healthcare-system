// src/backend/modules/state/StateService.js
// State machine for patient lifecycle management.

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logEvent } from "../audit/AuditService";

const COLLECTION = "patientState";

/**
 * Valid transitions for the patient lifecycle state machine.
 */
const TRANSITIONS = {
  REGISTERED: ["WAITING", "CONSULTATION", "DISCHARGED"],
  WAITING: ["CONSULTATION", "DISCHARGED"],
  CONSULTATION: ["TEST_PENDING", "ADMITTED", "DISCHARGED", "WAITING", "WAITING_FOR_RESOURCE", "NO_ROOM_AVAILABLE"],
  TEST_PENDING: ["CONSULTATION", "DISCHARGED"],
  ADMITTED: ["ICU", "DISCHARGED", "CONSULTATION", "NO_NURSE_AVAILABLE"],
  ICU: ["ADMITTED", "DISCHARGED"],
  WAITING_FOR_RESOURCE: ["CONSULTATION", "ADMITTED", "DISCHARGED"],
  NO_ROOM_AVAILABLE: ["WAITING", "CONSULTATION"],
  NO_NURSE_AVAILABLE: ["ADMITTED", "CONSULTATION"],
  DISCHARGED: ["REGISTERED"] // Patient can be re-registered
};

/**
 * Transition a patient to a new state.
 * @param {string} patientId - Patient ID
 * @param {string} nextState - State to transition to
 * @param {Object} user - User performing the action
 * @param {Object} metadata - Additional info (e.g., wardId, roomId)
 */
export const transition = async (patientId, nextState, user, metadata = {}) => {
  const stateRef = doc(db, COLLECTION, patientId);
  const stateSnap = await getDoc(stateRef);
  
  let currentState = "REGISTERED";
  if (stateSnap.exists()) {
    currentState = stateSnap.data().stage;
  }

  // 1. Validate Transition
  if (currentState !== nextState && !TRANSITIONS[currentState]?.includes(nextState)) {
    throw new Error(`Invalid transition: ${currentState} -> ${nextState}`);
  }

  // 2. Prepare Update
  const updateData = {
    patientId,
    stage: nextState,
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
    ...metadata
  };

  // 3. Execution
  if (!stateSnap.exists()) {
    await setDoc(stateRef, { ...updateData, createdAt: serverTimestamp() });
  } else {
    await updateDoc(stateRef, updateData);
  }

  // 4. Audit Log
  await logEvent({
    action: "STATE_TRANSITION",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId },
    metadata: {
      stateBefore: currentState,
      stateAfter: nextState,
      ...metadata
    }
  });

  return { success: true, from: currentState, to: nextState };
};
