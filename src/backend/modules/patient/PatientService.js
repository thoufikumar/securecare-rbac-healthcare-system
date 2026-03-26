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
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { encryptData, decryptData } from "../../security/encryption";
import { createPatientModel } from "./PatientModel";

const COLLECTION = "patients";

/**
 * Add a new patient record to Firestore (sensitive fields encrypted).
 * RBAC: Only Receptionists and Admins can create patients.
 */
export const addPatient = async (patientData, user) => {
  if (!user || (user.role !== "receptionist" && user.role !== "admin")) {
    throw new Error("Unauthorized: Only receptionists and admins can create patients");
  }

  const patient = createPatientModel({
    ...patientData,
    createdBy: user.uid
  });

  const encrypted = {
    ...patient,
    medicalHistory: encryptData(JSON.stringify(patient.medicalHistory)),
    prescriptions: encryptData(JSON.stringify(patient.prescriptions)),
    vitals: encryptData(JSON.stringify(patient.vitals)),
    contactNumber: encryptData(patient.contactNumber),
    address: encryptData(patient.address),
  };

  const docRef = await addDoc(collection(db, COLLECTION), encrypted);
  return docRef.id;
};

/**
 * Fetch a single patient by document ID and decrypt sensitive fields.
 */
export const getPatient = async (patientId) => {
  const docSnap = await getDoc(doc(db, COLLECTION, patientId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();

  // Helper to safely decrypt and parse
  const safeDecrypt = (ciphertext, fallback, isJson = true) => {
    if (!ciphertext) return fallback;
    try {
      const decrypted = decryptData(ciphertext);
      if (!decrypted) return fallback;
      return isJson ? JSON.parse(decrypted) : decrypted;
    } catch (e) {
      console.warn("Decryption failed for field", e);
      return fallback;
    }
  };

  return {
    ...data,
    id: docSnap.id,
    medicalHistory: safeDecrypt(data.medicalHistory, []),
    prescriptions: safeDecrypt(data.prescriptions, []),
    vitals: safeDecrypt(data.vitals, {}),
    contactNumber: safeDecrypt(data.contactNumber, data.contactNumber, false),
    address: safeDecrypt(data.address, data.address, false),
  };
};

/**
 * Add a prescription to a patient (appends to encrypted prescriptions array).
 * RBAC: Only Doctors can add prescriptions.
 */
export const addPrescriptionToPatient = async (patientId, prescriptionData, user) => {
  if (user.role !== "doctor") {
    throw new Error("Unauthorized: Only doctors can add prescriptions");
  }

  try {
    const patientRef = doc(db, COLLECTION, patientId);
    const docSnap = await getDoc(patientRef);

    if (!docSnap.exists()) {
      throw new Error("Patient not found");
    }

    const data = docSnap.data();

    // 🔓 Decrypt existing prescriptions
    let prescriptions = [];
    if (data.prescriptions) {
      try {
        const decrypted = decryptData(data.prescriptions);
        prescriptions = decrypted ? JSON.parse(decrypted) : [];
      } catch (e) {
        console.warn("Failed to parse prescriptions, initializing new array", e);
        prescriptions = [];
      }
    }

    // 🆕 New prescription object
    const newPrescription = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      ...prescriptionData,
      prescribedBy: user.uid,
      createdAt: new Date().toISOString()
    };

    // ➕ Append to local state
    prescriptions.push(newPrescription);

    // 🔐 Encrypt the full collection again
    const encryptedPrescriptions = encryptData(JSON.stringify(prescriptions));

    // 💾 Update Firestore
    await updateDoc(patientRef, {
      prescriptions: encryptedPrescriptions,
      updatedAt: new Date().toISOString()
    });

    return newPrescription;
  } catch (error) {
    console.error("Error adding prescription:", error);
    throw error;
  }
};

/**
 * Update patient vital signs.
 * RBAC: Both Doctors and Nurses can update vitals.
 */
export const updatePatientVitals = async (patientId, vitals, user) => {
  if (!["doctor", "nurse"].includes(user.role)) {
    throw new Error("Unauthorized: Only doctors and nurses can update vitals");
  }

  try {
    const patientRef = doc(db, COLLECTION, patientId);
    await updateDoc(patientRef, {
      vitals: {
        ...vitals,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      },
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating vitals:", error);
    throw error;
  }
};

/**
 * Fetch all patients for a given doctor.
 */
export const getPatientsByDoctor = async (doctorId) => {
  const q = query(
    collection(db, COLLECTION),
    where("assignedDoctorId", "==", doctorId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch all patients from Firestore.
 */
export const getAllPatients = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all patients:", error);
    throw error;
  }
};

/**
 * Fetch appointments based on role.
 */
export const getAppointmentsByRole = async (role, userId) => {
  try {
    let q;
    if (role === "doctor") {
      q = query(
        collection(db, "appointments"),
        where("doctorId", "==", userId)
      );
    } else {
      // For nurses/admins, show all for now
      q = query(collection(db, "appointments"));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

/**
 * Fetch recent audit logs for a user.
 */
export const getRecentActivities = async (userId) => {
  try {
    const q = query(
      collection(db, "auditLogs"),
      where("userId", "==", userId)
      // Note: Ordering requires composite index in Firestore if combined with where.
      // I'll keep it simple for now to avoid index requirements during demo.
    );
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort manually if no index
    return logs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds).slice(0, 5);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

/**
 * Update an existing patient record.
 */
export const updatePatient = async (patientId, updatedData) => {
  const patientRef = doc(db, COLLECTION, patientId);
  
  const encryptedData = { ...updatedData };

  if (updatedData.medicalHistory) {
    encryptedData.medicalHistory = encryptData(JSON.stringify(updatedData.medicalHistory));
  }
  if (updatedData.prescriptions) {
    encryptedData.prescriptions = encryptData(JSON.stringify(updatedData.prescriptions));
  }
  if (updatedData.vitals) {
    encryptedData.vitals = encryptData(JSON.stringify(updatedData.vitals));
  }
  if (updatedData.contactNumber) {
    encryptedData.contactNumber = encryptData(updatedData.contactNumber);
  }
  if (updatedData.address) {
    encryptedData.address = encryptData(updatedData.address);
  }

  await updateDoc(patientRef, { 
    ...encryptedData, 
    updatedAt: new Date().toISOString() 
  });
};

/**
 * Delete a patient record.
 */
export const deletePatient = async (patientId) => {
  await deleteDoc(doc(db, COLLECTION, patientId));
};
