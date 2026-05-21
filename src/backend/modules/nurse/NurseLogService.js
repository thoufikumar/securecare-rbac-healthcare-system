// src/backend/modules/nurse/NurseLogService.js
// Service for nurse bedside logs and vitals.
// Enforces: Append-only, AES encryption, Shift-based context.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { encryptData } from "../../security/encryption";
import { logEvent } from "../audit/AuditService";
import { secureWrapper } from "../../security/SecureWrapper";

const COLLECTION = "nurseLogs";

/**
 * Add a nurse log entry (Append-only).
 */
const _addNurseLog = async (data, user, context = {}) => {
  // 1. Encryption with Derived Patient Key
  const encrypted = {
    patientId: data.patientId,
    nurseId: user.uid,
    shift: data.shift,
    taskName: data.taskName,
    value: encryptData(data.value, data.patientId),
    notes: encryptData(data.notes, data.patientId),
    timestamp: serverTimestamp()
  };

  // 2. Execution
  const docRef = await addDoc(collection(db, COLLECTION), encrypted);

  // 3. Audit Log
  await logEvent({
    action: "NURSE_LOG_ADDED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: data.patientId, logId: docRef.id },
    metadata: { task: data.taskName, reason: context.reason }
  });

  return { id: docRef.id };
};

// EXPORT WRAPPED SERVICE
export const addNurseLog = secureWrapper(_addNurseLog, { allowedRoles: ["nurse"] });
