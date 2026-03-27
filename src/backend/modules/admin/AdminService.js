import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const COLLECTION = "admins";

/**
 * Initialize an admin record.
 */
export const createAdmin = async (data) => {
  try {
    const ref = doc(db, COLLECTION, data.id);
    await setDoc(ref, {
      ...data,
      userId: data.id,
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

/**
 * Fetch all admins.
 */
export const getAdmins = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};
