import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteField } from "firebase/firestore";

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

async function cleanup() {
  console.log("Starting patient schema cleanup...");
  const querySnapshot = await getDocs(collection(db, "patients"));
  
  let cleanedCount = 0;
  const updates = [];
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (Object.prototype.hasOwnProperty.call(data, "id")) {
      console.log(`Cleaning patient: ${docSnap.id}`);
      updates.push(updateDoc(doc(db, "patients", docSnap.id), {
        id: deleteField()
      }));
      cleanedCount++;
    }
  });

  await Promise.all(updates);
  console.log(`Successfully cleaned ${cleanedCount} patients.`);
}

cleanup().then(() => {
  console.log("Cleanup complete!");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
