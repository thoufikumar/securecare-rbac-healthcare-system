import { logEvent as secureLog } from "../modules/audit/AuditService";

/**
 * Backward-compatible logEvent wrapper.
 * Maps legacy params to the new AuditService schema.
 */
export const logEvent = async ({ userId, role, action, resource, status, details = "" }) => {
  return await secureLog({
    action,
    performedBy: { 
      userId: userId || "UNKNOWN", 
      role: role || "system", 
      email: "legacy-audit@securecare.com" 
    },
    target: { resource },
    metadata: { status, details }
  });
};
