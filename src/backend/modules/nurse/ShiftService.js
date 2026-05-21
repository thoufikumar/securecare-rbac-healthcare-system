// src/backend/modules/nurse/ShiftService.js
// Service for managing nurse shifts and ward assignments.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logEvent } from "../audit/AuditService";
import { validateRole } from "../../security/ValidationService";

const COLLECTION = "nurseShifts";

/**
 * Assign a group of nurses to a shift in a ward.
 * @param {Object} data - { shift, wardId, nurses: [], startTime, endTime }
 * @param {Object} user - Authenticated user (Admin/NurseManager)
 */
export const assignShift = async (data, user) => {
  validateRole(user, ["admin"]); // Only admins can assign shifts for now

  const shiftData = {
    ...data,
    assignedBy: user.uid,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, COLLECTION), shiftData);

  await logEvent({
    action: "SHIFT_ASSIGNED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { wardId: data.wardId },
    metadata: { shift: data.shift, nurseCount: data.nurses.length }
  });

  return docRef.id;
};
