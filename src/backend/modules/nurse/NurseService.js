// src/backend/modules/nurse/NurseService.js
// Business logic for nurse-related operations in Firestore.

import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "nurses";

/**
 * Fetch a nurse profile by user ID.
 */
export const getNurseProfile = async (nurseId) => {
  const docSnap = await getDoc(doc(db, COLLECTION, nurseId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
};

/**
 * Fetch patients assigned to a nurse's ward.
 */
export const getNurseWardPatients = async (ward) => {
  const q = query(
    collection(db, "patients"),
    where("ward", "==", ward)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
