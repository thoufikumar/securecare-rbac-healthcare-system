// src/frontend/modules/patient/CreatePatient.jsx
// Form component for registering a new patient.
// Delegates business logic to PatientService.

import { useState } from "react";
import { addPatient } from "../../../backend/modules/patient/PatientService";

const CreatePatient = () => {
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    contactNumber: "",
    address: "",
    assignedDoctorId: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const id = await addPatient(form);
      setStatus(`✅ Patient created with ID: ${id}`);
      setForm({ fullName: "", dateOfBirth: "", gender: "", bloodGroup: "", contactNumber: "", address: "", assignedDoctorId: "" });
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="create-patient-container">
      <h2>Register New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="bloodGroup" placeholder="Blood Group (e.g. O+)" value={form.bloodGroup} onChange={handleChange} />
        <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="assignedDoctorId" placeholder="Doctor ID" value={form.assignedDoctorId} onChange={handleChange} />
        <button type="submit">Create Patient Record</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CreatePatient;
