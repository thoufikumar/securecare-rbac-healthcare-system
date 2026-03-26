// src/backend/config/firebase.js
// Firebase configuration and initialization
// Replace the firebaseConfig values with your actual Firebase project credentials

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIZbsCgFv7X9DpUQEx5tJSXXSqt9TkuC8",
  authDomain: "care-170a2.firebaseapp.com",
  projectId: "care-170a2",
  storageBucket: "care-170a2.firebasestorage.app",
  messagingSenderId: "695929129111",
  appId: "1:695929129111:web:7430e52b67475e89b001d2",
  measurementId: "G-X173T8NQKV"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Secondary App for Admin user creation bypass
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");

// Export service instances
export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const db = getFirestore(app);

export default app;
