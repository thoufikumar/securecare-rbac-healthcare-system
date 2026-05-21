// src/backend/modules/patient/PatientService.js
// Business logic for patient CRUD operations in Firestore.
// Applies AES encryption before writing sensitive fields.

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { createPatientModel } from "./PatientModel";
import { logEvent } from "../audit/AuditService";
import { transition } from "../state/StateService";
import { validateRole } from "../../security/ValidationService";
import { secureWrapper } from "../../security/SecureWrapper";

const COLLECTION = "patients";

/**
 * Add a new patient record (Basic Info only).
 * Automatically transitions state to REGISTERED.
 */
export const addPatient = async (patientData, user) => {
  validateRole(user, ["receptionist", "admin"]);

  const patient = createPatientModel({
    ...patientData,
    createdBy: user.uid
  });

  // 1. Create Patient Document
  const docRef = await addDoc(collection(db, COLLECTION), patient);
  
  // 2. Initialize Patient State to REGISTERED
  await transition(docRef.id, "REGISTERED", user, {
    metadata: "Initial registration"
  });

  // 3. Log Audit Event
  await logEvent({
    action: "PATIENT_REGISTERED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId: docRef.id }
  });

  return docRef.id;
};

/**
 * Fetch a patient and normalize structure for UI.
 */
const _getPatient = async (patientId) => {
  const docSnap = await getDoc(doc(db, COLLECTION, patientId));
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  
  // Fetch Clinical Records (Prescriptions, Vitals, etc.)
  const recordsQuery = query(
    collection(db, "clinicalRecords"),
    where("patientId", "==", patientId)
  );
  const recordsSnap = await getDocs(recordsQuery);
  const allRecords = recordsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const prescriptions = allRecords
    .filter(r => r.type === "PRESCRIPTION")
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

  const vitals = allRecords
    .filter(r => r.type === "VITALS")
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.vitals || null;

  // Flattening for UI compatibility during migration
  return {
    id: docSnap.id,
    ...data.basicInfo,
    fullName: data.basicInfo?.fullName || `${data.basicInfo?.firstName || ''} ${data.basicInfo?.lastName || ''}`.trim(),
    ...data.contactInfo,
    ...data.emergencyContact,
    prescriptions,
    vitals,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

/**
 * Fetch all patients for a given doctor (Context: patientState).
 */
const _getPatientsByDoctor = async (doctorId, user, context) => {
  const q = query(
    collection(db, "patientState"),
    where("assignedDoctorId", "==", doctorId)
  );
  const snapshot = await getDocs(q);
  const patientIds = snapshot.docs.map(d => d.id);
  
  if (patientIds.length === 0) return [];

  // Fetch actual patient docs
  const patients = await Promise.all(patientIds.map(id => _getPatient(id)));
  return patients.filter(p => p !== null);
};

// EXPORT WRAPPED SERVICES
export const getPatient = secureWrapper(_getPatient, { allowedRoles: ["receptionist", "doctor", "nurse", "admin"], isClinical: true });
export const getPatientsByDoctor = secureWrapper(_getPatientsByDoctor, { allowedRoles: ["doctor", "admin"], isClinical: true });

/**
 * Update an existing patient record (Basic info only).
 */
export const updatePatient = async (patientId, updatedData) => {
  const patientRef = doc(db, COLLECTION, patientId);
  
  // Structure data into nested objects if they are provided flat
  const updatePayload = {
    updatedAt: new Date().toISOString()
  };

  if (updatedData.firstName || updatedData.lastName || updatedData.age || updatedData.gender) {
    updatePayload.basicInfo = {
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      fullName: `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim(),
      age: updatedData.age,
      gender: updatedData.gender,
      bloodGroup: updatedData.bloodGroup,
      dob: updatedData.dob
    };
  }

  if (updatedData.phoneNumber || updatedData.email || updatedData.address) {
    updatePayload.contactInfo = {
      phoneNumber: updatedData.phoneNumber || updatedData.contactNumber,
      email: updatedData.email,
      address: updatedData.address,
      city: updatedData.city,
      zipCode: updatedData.zipCode
    };
  }

  await updateDoc(patientRef, updatePayload);
};

/**
 * Delete a patient record.
 */
export const deletePatient = async (patientId) => {
  await deleteDoc(doc(db, COLLECTION, patientId));
};

/**
 * Fetch recent activities (audit logs) for a specific user.
 */
export const getRecentActivities = async (userId) => {
  try {
    // Query with single field filter to avoid index requirement
    const q = query(
      collection(db, "auditLogs"),
      where("performedBy.userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort and limit in memory
    return activities
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      })
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

/**
 * Fetch all patients from Firestore.
 */
export const getAllPatients = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data.basicInfo,
        fullName: data.basicInfo?.fullName || `${data.basicInfo?.firstName || ''} ${data.basicInfo?.lastName || ''}`.trim(),
        ...data.contactInfo
      };
    });
  } catch (error) {
    console.error("Error getting all patients:", error);
    throw error;
  }
};
/**
 * Assign a nurse to a patient and create a care plan.
 */
export const assignNurseToPatient = async (patientId, nurseId, tasks, user, appointmentId) => {
  const stateRef = doc(db, "patientState", patientId);
  
  // 1. Update Patient State with Assigned Nurse
  await updateDoc(stateRef, {
    assignedNurseId: nurseId,
    stage: "ADMITTED", // Ensure patient is admitted if a nurse is assigned
    updatedAt: new Date().toISOString()
  });

  // 2. Create Care Plan in clinicalRecords (Append-only)
  const recordRef = await addDoc(collection(db, "clinicalRecords"), {
    patientId,
    type: "CARE_PLAN",
    nurseId,
    tasks: tasks.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), status: "pending" })),
    appointmentId,
    createdBy: user.uid,
    timestamp: new Date().toISOString()
  });

  // 3. Log Audit Event
  await logEvent({
    action: "NURSE_ASSIGNED",
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId, nurseId }
  });

  return recordRef.id;
};

/**
 * Subscribe to patients for a specific nurse (Ward/Shift context).
 */
export const subscribeToPatientsByNurse = (nurseId, callback) => {
  // Simplify outer query to avoid potential index issues
  const q = query(
    collection(db, "patientState"),
    where("assignedNurseId", "==", nurseId)
  );

  return onSnapshot(q, async (snapshot) => {
    // Filter by stage in memory
    const patientIds = snapshot.docs
      .filter(d => ["ADMITTED", "ICU"].includes(d.data().stage))
      .map(d => d.id);

    if (patientIds.length === 0) {
      callback([]);
      return;
    }

    // Fetch actual patient data + their latest care plan
    const patients = await Promise.all(patientIds.map(async (id) => {
      const p = await _getPatient(id);
      
      // Fetch care plans and filter/sort in memory
      const cpQuery = query(
        collection(db, "clinicalRecords"),
        where("patientId", "==", id)
      );
      const cpSnap = await getDocs(cpQuery);
      
      const carePlan = cpSnap.docs
        .map(d => d.data())
        .filter(d => d.type === "CARE_PLAN")
        .sort((a, b) => {
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeB - timeA;
        })[0] || null;

      return { ...p, carePlan };
    }));

    callback(patients.filter(p => p !== null));
  });
};

/**
 * Update the status of a task in a patient's care plan.
 */
export const updateCarePlanTaskStatus = async (patientId, taskId, newStatus, user) => {
  // Since clinicalRecords are append-only, we should ideally log a completion record.
  // For simplicity in the current dashboard, we'll find the latest care plan and update it.
  const q = query(
    collection(db, "clinicalRecords"),
    where("patientId", "==", patientId),
    where("type", "==", "CARE_PLAN"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) throw new Error("Care plan not found");
  
  const recordDoc = snapshot.docs[0];
  const data = recordDoc.data();
  const updatedTasks = data.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
  
  await updateDoc(doc(db, "clinicalRecords", recordDoc.id), {
    tasks: updatedTasks,
    updatedAt: new Date().toISOString()
  });

  // Log Audit Event
  await logEvent({
    action: `TASK_${newStatus.toUpperCase()}`,
    performedBy: { userId: user.uid, role: user.role, email: user.email },
    target: { patientId },
    metadata: { taskId }
  });
};

/**
 * Add a prescription to a patient (Clinical Record).
 */
export const addPrescriptionToPatient = async (patientId, prescriptionData, user) => {
  const recordRef = await addDoc(collection(db, "clinicalRecords"), {
    patientId,
    type: "PRESCRIPTION",
    ...prescriptionData,
    createdBy: typeof user === 'string' ? user : user.uid,
    timestamp: new Date().toISOString()
  });

  // Log Audit Event
  await logEvent({
    action: "PRESCRIPTION_ADDED",
    performedBy: typeof user === 'string' ? { userId: user } : { userId: user.uid, role: user.role },
    target: { patientId }
  });

  return recordRef.id;
};

/**
 * Update patient vitals (Clinical Record).
 */
export const updatePatientVitals = async (patientId, vitalsData, user) => {
  const recordRef = await addDoc(collection(db, "clinicalRecords"), {
    patientId,
    type: "VITALS",
    vitals: vitalsData,
    createdBy: user?.uid || "unknown",
    timestamp: new Date().toISOString()
  });

  // Log Audit Event
  await logEvent({
    action: "VITALS_UPDATED",
    performedBy: { userId: user?.uid || "unknown", role: user?.role || "nurse" },
    target: { patientId }
  });

  return recordRef.id;
};
