import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "auditLogs";

/**
 * Log a structured clinical or system event.
 * @param {Object} params
 * @param {string} params.action - PATIENT_CREATED | APPOINTMENT_CREATED | NURSE_ASSIGNED | TASK_COMPLETED
 * @param {Object} params.performedBy - { userId, role, email }
 * @param {Object} [params.target] - { patientId, doctorId, nurseId }
 * @param {Object} [params.metadata] - { timeTaken, numberOfPatientsHandled, taskDetails }
 */
export const logEvent = async ({ action, performedBy, target = {}, metadata = {} }) => {
  try {
    // Standardize performedBy to prevent schema breakage
    const standardPerformedBy = performedBy || {
      userId: "SYSTEM_AUTO",
      role: "admin",
      email: "system-audit@securecare.com"
    };

    await addDoc(collection(db, COLLECTION), {
      action,
      performedBy: standardPerformedBy,
      target,
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("[AuditService] Failed to write log:", err);
  }
};

/**
 * Fetch all audit logs for admin review.
 */
export const getAuditLogs = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[AuditService] Error fetching logs:", err);
    throw err;
  }
};

/**
 * AI Audit Analyzer (Concept Implementation)
 * Scans logs for anomalies and suspicious patterns.
 */
export const analyzeAuditLogs = (logs) => {
  const anomalies = [];

  // Group logs by user and time
  const logsByUser = {};
  logs.forEach(log => {
    // Skip logs without performance metadata to prevent crashes during analysis
    if (!log.performedBy?.userId) return;

    const uid = log.performedBy.userId;
    if (!logsByUser[uid]) logsByUser[uid] = [];
    logsByUser[uid].push(log);
  });

  Object.entries(logsByUser).forEach(([uid, userLogs]) => {
    if (userLogs.length === 0) return;

    const firstLog = userLogs[0];
    const userRole = firstLog.performedBy?.role || 'unknown';
    const userEmail = firstLog.performedBy?.email || 'unknown';

    // RULE 1: Doctor attending multiple patients too quickly
    if (userRole === "doctor") {
      // Check for clusters of "PATIENT_CREATED" or "APPOINTMENT_CREATED" (placeholder for "attending")
      // In this system, doctor attends by being assigned or completing tasks
      const appointmentLogs = userLogs.filter(l => l.action === "APPOINTMENT_CREATED")
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

      for (let i = 0; i < appointmentLogs.length - 2; i++) {
        const timeDiff = (appointmentLogs[i + 2].timestamp?.seconds - appointmentLogs[i].timestamp?.seconds) / 60;
        if (timeDiff > 0 && timeDiff <= 2) {
          anomalies.push({
            issue: `Unusual activity: Doctor ${userEmail} handled 3 appointments in ${Math.round(timeDiff)} minutes.`,
            severity: "high",
            recommendation: "Verify consultation records for these appointments to ensure patient safety."
          });
        }
      }
    }

    // RULE 2: Nurse completes tasks too quickly
    if (userRole === "nurse") {
      const taskLogs = userLogs.filter(l => l.action === "TASK_COMPLETED")
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

      for (let i = 0; i < taskLogs.length - 1; i++) {
        const timeDiff = (taskLogs[i + 1].timestamp?.seconds - taskLogs[i].timestamp?.seconds) / 60;
        if (timeDiff > 0 && timeDiff < 0.5) { // Less than 30 seconds
          anomalies.push({
            issue: `Tasks completed faster than expected by Nurse ${userEmail}.`,
            severity: "medium",
            recommendation: "Check if tasks were actually performed or if this is a false reporting pattern."
          });
        }
      }
    }


    // RULE 4: Missing logs (Assigned but no activity)
    // This would require checking patient assignments vs logs, 
    // Simplified: check if NURSE_ASSIGNED exists for a patient but no TASK_COMPLETED
  });

  return anomalies;
};
