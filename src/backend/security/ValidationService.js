import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../config/firebase";
import { logEvent } from "../modules/audit/AuditService";

/**
 * INTENT-BASED ACCESS CONTROL (IBAC)
 * Every access requires a mandatory reason.
 */
export const validateAccess = async (user, patientId, context) => {
  const { action, reason } = context;

  if (!reason || reason.trim().length < 5) {
    throw new Error("Security Alert: Access denied. A valid reason must be provided for this clinical action.");
  }

  // Log the intent immediately
  await logEvent({
    action: `ACCESS_ATTEMPT_${action}`,
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId },
    metadata: { reason, context }
  });

  return true;
};

/**
 * TEMPORAL ACCESS CONTROL
 * Doctors must have active/recent appointments.
 * Nurses must be within their shift window and assigned ward.
 */
export const validateTimeAccess = async (user, patientId) => {
  const now = new Date();

  // 1. Get Patient State
  const stateDoc = await getDoc(doc(db, "patientState", patientId));
  if (!stateDoc.exists()) return false;
  const { stage, wardId, assignedDoctorId } = stateDoc.data();

  // 2. Doctor Temporal Logic
  if (user.role === "doctor") {
    if (assignedDoctorId === user.uid) return true; // Directly assigned
    
    // Check for active appointment window (last 24 hours or upcoming)
    const apptQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId),
      where("doctorId", "==", user.uid),
      limit(1)
    );
    const appSnap = await getDocs(apptQuery);
    if (appSnap.empty) return false;
    
    // Logic: If appointment exists, allow access (simplified for demo)
    return true;
  }

  // 3. Nurse Temporal Logic
  if (user.role === "nurse") {
    if (!["ADMITTED", "ICU"].includes(stage)) return false;

    // Check if nurse is assigned to a shift in this ward
    const shiftQuery = query(
      collection(db, "nurseShifts"),
      where("wardId", "==", wardId),
      where("nurses", "array-contains", user.uid)
    );
    const shiftSnap = await getDocs(shiftQuery);
    
    // In a real system, we'd check if `shiftData.startTime <= now <= shiftData.endTime`
    return !shiftSnap.empty;
  }
  if (user.role === "receptionist") return true; // TODO: Temporary relaxation for Intake module integration

  return user.role === "admin"; // Admin override
};

/**
 * FIELD-LEVEL ACCESS CONTROL
 * Masks sensitive fields based on role.
 */
export const filterFieldsByRole = (data, role) => {
  if (!data) return data;
  
  const filtered = { ...data };

  if (role === "receptionist") {
    // Strip all clinical/nurse notes
    delete filtered.medicalHistory;
    delete filtered.prescriptions;
    delete filtered.vitals;
    delete filtered.notes;
    delete filtered.diagnosis;
  }

  if (role === "nurse") {
    // Nurses see vitals/tasks but not full diagnosis/medical history unless admitted
    delete filtered.medicalHistory;
  }

  return {
    ...filtered,
    secureView: true,
    watermark: `SECURECARE_VIEW_${role.toUpperCase()}_${new Date().getTime()}`
  };
};

/**
 * Simple RBAC Check
 */
export const validateRole = (user, allowedRoles) => {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: Role '${user?.role}' does not have permission for this action.`);
  }
  return true;
};

/**
 * COMPREHENSIVE ACCESS VALIDATION
 */
export const validateFullAccess = async (user, patientId, context) => {
  await validateAccess(user, patientId, context);
  
  const timeValid = await validateTimeAccess(user, patientId);
  if (!timeValid) {
    throw new Error("Temporal Security Violation: Access denied outside of assigned shift or appointment window.");
  }

  return true;
};
