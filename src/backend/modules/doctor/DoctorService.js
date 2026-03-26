// src/backend/modules/doctor/DoctorService.js
// Business logic for doctor-related operations in Firestore.

import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "doctors";

/**
 * Fetch a doctor profile by user ID.
 */
export const getDoctorProfile = async (doctorId) => {
  const docSnap = await getDoc(doc(db, COLLECTION, doctorId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
};

/**
 * Fetch all patients assigned to this doctor.
 */
export const getDoctorPatients = async (doctorId) => {
  const q = query(
    collection(db, "patients"),
    where("assignedDoctorId", "==", doctorId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
