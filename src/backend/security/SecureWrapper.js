// src/backend/security/SecureWrapper.js
// Higher-order function to wrap service calls with advanced security layers.

import { validateFullAccess, filterFieldsByRole } from "./ValidationService";

/**
 * Wraps a service function with security checks.
 * @param {Function} fn - The service function to wrap
 * @param {Object} options - { allowedRoles, isClinical }
 */
export const secureWrapper = (fn, options = {}) => {
  const { allowedRoles = [], isClinical = true } = options;

  return async (...args) => {
    // Current pattern: (data, user, context)
    // For getPatient: (patientId, user, context)
    const [idOrData, user, contextArg = {}] = args;
    const context = contextArg || {};
    const patientId = typeof idOrData === "string" ? idOrData : idOrData.patientId;

    if (!user) throw new Error("Security Violation: User session not found.");

    // 1. RBAC Check (Role exists in allowed list)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new Error(`Unauthorized: Role '${user.role}' cannot perform this action.`);
    }

    // 2. Clinical Context Check (IBAC + Temporal)
    if (isClinical && patientId) {
      await validateFullAccess(user, patientId, context);
    }

    // 3. Execute original function
    const result = await fn(...args);

    // 4. Data Exposure Control (Filter fields based on role)
    if (isClinical) {
      return filterFieldsByRole(result, user.role);
    }

    return result;
  };
};
