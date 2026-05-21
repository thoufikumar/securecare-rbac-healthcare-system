// src/backend/modules/clinical/ClinicalService.js
// Service for clinical records and medical history.
// Enforces: Append-only (no updates), AES encryption.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { encryptData } from "../../security/encryption";
import { logEvent } from "../audit/AuditService";
import { secureWrapper } from "../../security/SecureWrapper";

const RECORDS_COLLECTION = "clinicalRecords";
const HISTORY_COLLECTION = "medicalHistory";

/**
 * Add a new clinical entry (Append-only).
 */
const _addClinicalEntry = async (data, user, context = {}) => {
  // 1. Encryption with Derived Patient Key
  const encrypted = {
    patientId: data.patientId,
    doctorId: user.uid,
    visitType: data.visitType,
    symptoms: encryptData(data.symptoms, data.patientId),
    diagnosis: encryptData(data.diagnosis, data.patientId),
    prescriptions: encryptData(JSON.stringify(data.prescriptions || []), data.patientId),
    notes: encryptData(data.notes, data.patientId),
    timestamp: serverTimestamp()
  };

  // 2. Append-only write
  const docRef = await addDoc(collection(db, RECORDS_COLLECTION), encrypted);

  // 3. Audit Log (Includes reasoning from context)
  await logEvent({
    action: "CLINICAL_RECORD_ADDED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: data.patientId, recordId: docRef.id },
    metadata: { reason: context.reason }
  });

  return { id: docRef.id, message: "Clinical record secured and saved." };
};

/**
 * Record patient medical history.
 */
const _recordMedicalHistory = async (data, user, context = {}) => {
  const encrypted = {
    patientId: data.patientId,
    conditions: encryptData(JSON.stringify(data.conditions || []), data.patientId),
    allergies: encryptData(JSON.stringify(data.allergies || []), data.patientId),
    surgeries: encryptData(JSON.stringify(data.surgeries || []), data.patientId),
    chronicDiseases: encryptData(JSON.stringify(data.chronicDiseases || []), data.patientId),
    pastMedications: encryptData(JSON.stringify(data.pastMedications || []), data.patientId),
    familyHistory: encryptData(data.familyHistory || "", data.patientId),
    lifestyle: encryptData(JSON.stringify(data.lifestyle || {}), data.patientId),
    recordedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, HISTORY_COLLECTION), encrypted);

  await logEvent({
    action: "MEDICAL_HISTORY_RECORDED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: data.patientId },
    metadata: { reason: context.reason }
  });

  return { id: docRef.id };
};

// EXPORT WRAPPED SERVICES
// TODO: Restrict access to doctor/patient later (Receptionist allowed temporarily for flow integration)
export const addClinicalEntry = secureWrapper(_addClinicalEntry, { allowedRoles: ["doctor", "admin"] });
export const recordMedicalHistory = secureWrapper(_recordMedicalHistory, { allowedRoles: ["receptionist", "doctor", "admin"] });
