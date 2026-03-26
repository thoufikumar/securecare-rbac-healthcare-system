// src/frontend/modules/nurse/NurseDashboard.jsx
// Dashboard view for authenticated nurses.

import { useEffect, useState } from "react";
import { getNurseWardPatients } from "../../../backend/modules/nurse/NurseService";
import useAuth from "../../../backend/modules/auth/useAuth";

const NurseDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);

  // TODO: Replace "Ward-A" with the actual ward fetched from the nurse's Firestore profile
  const ward = "Ward-A";

  useEffect(() => {
    getNurseWardPatients(ward).then(setPatients).catch(console.error);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Nurse Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <h2>Ward: {ward} — Patients ({patients.length})</h2>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>{p.fullName}</li>
        ))}
      </ul>
    </div>
  );
};

export default NurseDashboard;
