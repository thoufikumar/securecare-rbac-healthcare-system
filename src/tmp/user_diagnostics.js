import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIZbsCgFv7X9DpUQEx5tJSXXSqt9TkuC8",
  authDomain: "care-170a2.firebaseapp.com",
  projectId: "care-170a2",
  storageBucket: "care-170a2.firebasestorage.app",
  messagingSenderId: "695929129111",
  appId: "1:695929129111:web:7430e52b67475e89b001d2",
  measurementId: "G-X173T8NQKV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function diagnostics() {
  console.log("Fetching all users from 'users' collection...");
  const querySnapshot = await getDocs(collection(db, "users"));
  
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    console.log(`User: ${data.email} | Role: ${data.role} | ID: ${docSnap.id}`);
  });
}

diagnostics().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
