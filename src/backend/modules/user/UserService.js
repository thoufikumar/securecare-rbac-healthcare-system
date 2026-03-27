import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Fetch a user by UID.
 */
export const getUserById = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Fetch all users with a specific role.
 */
export const getUsersByRole = async (role) => {
  try {
    const q = query(collection(db, "users"), where("role", "==", role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    throw error;
  }
};
