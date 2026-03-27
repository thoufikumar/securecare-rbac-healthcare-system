import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";

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

async function cleanupRoles() {
  const incorrectNurses = [
    "thoufikumar.a2023cse@sece.ac.in",
    "testmailid3422@gmail.com"
  ];

  console.log("Cleaning up incorrect nurse roles...");
  
  for (const email of incorrectNurses) {
    const q = query(collection(db, "users"), where("email", "==", email), where("role", "==", "nurse"));
    const snapshot = await getDocs(q);
    
    for (const docSnap of snapshot.docs) {
      console.log(`Deleting incorrect nurse record for: ${email} (ID: ${docSnap.id})`);
      await deleteDoc(doc(db, "users", docSnap.id));
    }
  }

  console.log("Cleanup finished.");
}

cleanupRoles().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
