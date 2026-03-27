import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "doctors";

/**
 * Initialize a doctor record and store in 'doctors' collection.
 */
export const createDoctor = async (doctorData) => {
  try {
    const doctorRef = doc(db, COLLECTION, doctorData.id);
    await setDoc(doctorRef, {
      ...doctorData,
      userId: doctorData.id,
      assignedPatients: [],
      active: true,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};

/**
 * Fetch all registered doctors.
 */
export const getDoctors = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

/**
 * Get a specific doctor's profile.
 */
export const getDoctorById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};
