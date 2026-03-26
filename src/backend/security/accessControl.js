// src/modules/security/accessControl.js
// Role-based and context-based access control logic.
// Centralizes permission checks so they are never scattered across UI components.

/**
 * Role-permission matrix.
 * Keys are roles; values are arrays of allowed actions.
 */
const PERMISSIONS = {
  admin: ["read:any", "write:any", "delete:any", "view:logs", "manage:users"],
  doctor: ["read:patient", "write:patient", "view:prescriptions"],
  nurse: ["read:patient", "write:vitals"],
  receptionist: ["read:patient", "write:appointment", "view:schedule"],
};

/**
 * Check if a user role has permission for an action.
 * @param {string} role - User role (e.g. "doctor")
 * @param {string} action - Action string (e.g. "read:patient")
 * @returns {boolean}
 */
export const hasPermission = (role, action) => {
  if (!role || !PERMISSIONS[role]) return false;
  return (
    PERMISSIONS[role].includes(action) ||
    PERMISSIONS[role].includes("read:any") ||
    PERMISSIONS[role].includes("write:any")
  );
};

/**
 * Context-aware access check.
 * Example: a doctor can only access their own patients.
 * @param {Object} user - { uid, role }
 * @param {Object} resource - { ownerId, type }
 * @returns {boolean}
 */
export const canAccessResource = (user, resource) => {
  if (!user || !resource) return false;
  if (user.role === "admin") return true;
  if (user.role === "doctor" && resource.assignedDoctorId === user.uid) return true;
  if (user.role === "nurse" && resource.ward === user.ward) return true;
  return false;
};
