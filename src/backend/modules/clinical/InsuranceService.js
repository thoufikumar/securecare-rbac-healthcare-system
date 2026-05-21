// src/backend/modules/clinical/InsuranceService.js
// Service for patient insurance record management.
// Enforces: AES encryption of PII/Policy data.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { encryptData } from "../../security/encryption";
import { logEvent } from "../audit/AuditService";
import { secureWrapper } from "../../security/SecureWrapper";

const COLLECTION = "insuranceDetails";

/**
 * Save or update patient insurance details.
 */
const _saveInsuranceDetails = async (data, user, context = {}) => {
  const encrypted = {
    patientId: data.patientId,
    provider: encryptData(data.provider, data.patientId),
    policyNumber: encryptData(data.policyNumber, data.patientId),
    coverageType: encryptData(data.coverageType, data.patientId), // Stateless / Reimbursement
    validUntil: data.validUntil, // Date (searchable, non-clinical)
    notes: encryptData(data.notes || "", data.patientId),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, COLLECTION), encrypted);

  await logEvent({
    action: "SENSITIVE_DATA_ADDED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: data.patientId, resource: "INSURANCE" },
    metadata: { reason: context.reason || "Initial Medical Intake" }
  });

  return { id: docRef.id };
};

// TODO: Restrict access to doctor/patient later (Receptionist allowed temporarily for flow integration)
export const saveInsuranceDetails = secureWrapper(_saveInsuranceDetails, { allowedRoles: ["receptionist", "doctor", "admin"] });
