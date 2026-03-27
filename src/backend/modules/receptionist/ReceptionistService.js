import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "receptionists";

/**
 * Initialize a receptionist record.
 */
export const createReceptionist = async (data) => {
  try {
    const ref = doc(db, COLLECTION, data.id);
    await setDoc(ref, {
      ...data,
      userId: data.id,
      active: true,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating receptionist:", error);
    throw error;
  }
};

/**
 * Fetch all receptionists.
 */
export const getReceptionists = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching receptionists:", error);
    throw error;
  }
};
