// src/backend/security/breachSimulator.js
// Simulates unauthorized access scenarios for security testing.
// Use ONLY in development/admin environments – NEVER in production patient flows.

import { logEvent } from "./auditLogger";

/**
 * Simulate a role escalation attack:
 * A low-privilege user attempts to access admin-only data.
 * @param {Object} user - { uid, role }
 */
export const simulateRoleEscalation = async (user) => {
  console.warn("[BreachSimulator] Simulating role escalation for:", user);
  await logEvent({
    userId: user.uid,
    role: user.role,
    action: "PRIVILEGE_ESCALATION_ATTEMPT",
    resource: "admin/users",
    status: "BREACH_ATTEMPT",
    details: `User with role '${user.role}' attempted to access admin resource.`,
  });
  return { breachType: "role_escalation", detected: true };
};

/**
 * Simulate an unauthorized cross-patient data access attempt.
 * @param {Object} user - { uid, role }
 * @param {string} targetPatientId - ID of the patient the user should NOT access
 */
export const simulateCrossPatientAccess = async (user, targetPatientId) => {
  console.warn("[BreachSimulator] Simulating cross-patient access by:", user);
  await logEvent({
    userId: user.uid,
    role: user.role,
    action: "UNAUTHORIZED_PATIENT_ACCESS",
    resource: `patients/${targetPatientId}`,
    status: "BREACH_ATTEMPT",
    details: `User attempted to access patient data they are not assigned to.`,
  });
  return { breachType: "cross_patient_access", detected: true };
};

/**
 * Simulate a brute-force login attempt (logged only – no actual auth call).
 * @param {string} attemptedEmail - Email targeted in the attack
 */
export const simulateBruteForce = async (attemptedEmail) => {
  console.warn("[BreachSimulator] Simulating brute-force on:", attemptedEmail);
  await logEvent({
    userId: "UNKNOWN",
    role: "NONE",
    action: "BRUTE_FORCE_LOGIN",
    resource: `auth/${attemptedEmail}`,
    status: "BREACH_ATTEMPT",
    details: `Multiple failed login attempts detected for ${attemptedEmail}.`,
  });
  return { breachType: "brute_force", detected: true };
};
