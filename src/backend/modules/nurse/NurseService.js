import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "nurses";

/**
 * Initialize a nurse record in the 'nurses' collection.
 */
export const createNurse = async (nurseData) => {
  try {
    const nurseRef = doc(db, COLLECTION, nurseData.id);
    await setDoc(nurseRef, {
      ...nurseData,
      userId: nurseData.id,
      assignedPatientsCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating nurse:", error);
    throw error;
  }
};

/**
 * Fetch all registered nurses.
 */
export const getNurses = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching nurses:", error);
    throw error;
  }
};

/**
 * Get a specific nurse's profile.
 */
export const getNurseById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error fetching nurse:", error);
    throw error;
  }
};
