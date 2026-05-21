// src/backend/modules/clinical/DataExposureService.js
// Service for time-limited, audited reveal of sensitive data.

import { decryptData } from "../../security/encryption";
import { logEvent } from "../audit/AuditService";
import { validateFullAccess } from "../../security/ValidationService";

/**
 * Reveals a masked clinical field for a limited time.
 * @param {string} patientId - Patient ID
 * @param {string} field - Field name (e.g., "diagnosis")
 * @param {string} encryptedValue - The ciphertext to decrypt
 * @param {Object} user - Authenticated user
 * @param {Object} context - { reason, timestamp }
 */
export const revealSensitiveData = async (patientId, field, encryptedValue, user, context) => {
  // 1. Re-validate access with current context
  await validateFullAccess(user, patientId, context);

  // 2. Decrypt using Derived Client Key
  const decrypted = decryptData(encryptedValue, patientId);

  // 3. Audit Log the "Reveal" Event
  await logEvent({
    action: "SENSITIVE_DATA_REVEAL",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId },
    metadata: { field, reason: context.reason, timeLimited: true }
  });

  return {
    field,
    value: decrypted,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min visibility
    secureView: true
  };
};
