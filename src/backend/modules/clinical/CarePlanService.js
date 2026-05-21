// src/backend/modules/clinical/CarePlanService.js
// Service for managing patient care plans (tasks assigned by doctors).

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logEvent } from "../audit/AuditService";
import { validateRole } from "../../security/ValidationService";

const COLLECTION = "carePlans";

/**
 * Create a new care plan for a patient.
 * @param {Object} data - { patientId, tasks: [{ taskName, frequency, priority, instructions }] }
 * @param {Object} user - Authenticated user (Doctor)
 */
export const createCarePlan = async (data, user) => {
  validateRole(user, ["doctor"]);

  const plan = {
    patientId: data.patientId,
    doctorId: user.uid,
    tasks: data.tasks.map(t => ({
      ...t,
      status: "pending",
      createdAt: new Date().toISOString()
    })),
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, COLLECTION), plan);

  await logEvent({
    action: "CARE_PLAN_CREATED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: data.patientId, planId: docRef.id }
  });

  return docRef.id;
};
