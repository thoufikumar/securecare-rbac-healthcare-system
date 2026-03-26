// src/backend/security/auditLogger.js
// Writes access/action events to the Firestore `auditLogs` collection.
// Every sensitive operation must call logEvent() for traceability.

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Log a security-relevant event to Firestore.
 * @param {Object} params
 * @param {string} params.userId   - UID of the acting user
 * @param {string} params.role     - Role of the acting user
 * @param {string} params.action   - Action performed (e.g. "READ_PATIENT")
 * @param {string} params.resource - Resource targeted (e.g. "patients/abc123")
 * @param {string} params.status   - "SUCCESS" | "DENIED" | "BREACH_ATTEMPT"
 * @param {string} [params.details] - Optional extra context
 */
export const logEvent = async ({ userId, role, action, resource, status, details = "" }) => {
  try {
    await addDoc(collection(db, "auditLogs"), {
      userId,
      role,
      action,
      resource,
      status,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    // Never let logging failures crash the main application
    console.error("[AuditLogger] Failed to write log:", err);
  }
};
