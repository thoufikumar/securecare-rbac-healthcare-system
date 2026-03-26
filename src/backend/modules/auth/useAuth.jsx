// src/backend/modules/auth/useAuth.jsx
// Global Auth Context
// Employs strict Firestore role validation matching Firebase Auth credentials.

import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, secondaryAuth, db } from "../../config/firebase";
import { logEvent } from "../../security/auditLogger";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("User role not found");
    }

    return docSnap.data().role;
  };

  // Restore session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const role = await fetchUserRole(firebaseUser.uid);
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (e) {
          console.error("Session restore error", e);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Secure login fetching specific document scopes bypassing local spoofing
   */
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const uid = userCredential.user.uid;

      // 🔥 fetch role from Firestore
      const role = await fetchUserRole(uid);

      const userData = {
        uid,
        email,
        role
      };

      // Save session
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Log success event (Audit log doesn't block login if it fails)
      logEvent({
        userId: uid,
        role: role,
        action: "LOGIN_SUCCESS",
        resource: `auth/${email}`,
        status: "SUCCESS",
      }).catch(console.warn);

      return userData;

    } catch (err) {
      // Log failure event
      logEvent({
        userId: "UNKNOWN",
        role: "UNKNOWN",
        action: "LOGIN_FAILED",
        resource: `auth/${email}`,
        status: "FAILED",
        details: err.message,
      }).catch(console.warn);

      // Cleanly throw user-friendly error messages if desired, or let UI handle it
      throw err;
    }
  };

  /**
   * Cleanup local storage on logout
   */
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => user;

  /**
   * Firebase Password Reset
   */
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * Firebase Admin User Creation
   */
  const createUserByAdmin = async (newEmail, newPassword, newRole) => {
    try {
      // Create user silently via disconnected instance
      const cred = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newPassword);
      const newUid = cred.user.uid;

      // Assign Firestore Role
      await setDoc(doc(db, "users", newUid), {
        email: newEmail,
        role: newRole,
        createdAt: new Date().toISOString()
      });

      // Send password reset email natively so the user takes over their password
      await sendPasswordResetEmail(auth, newEmail);

      // Cleanup trailing auth state instantly
      await signOut(secondaryAuth);

      logEvent({
        userId: user?.uid || "UNKNOWN",
        role: user?.role || "admin",
        action: "ADMIN_CREATE_USER",
        resource: `users/${newUid}`,
        status: "SUCCESS"
      }).catch(console.warn);

      return { success: true, message: "User created. Password reset email sent." };
    } catch (err) {
      logEvent({
        userId: user?.uid || "UNKNOWN",
        role: user?.role || "admin",
        action: "ADMIN_CREATE_USER",
        resource: `users/new`,
        status: "FAILED",
        details: err.message
      }).catch(console.warn);
      
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getCurrentUser, resetPassword, createUserByAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default useAuth;
