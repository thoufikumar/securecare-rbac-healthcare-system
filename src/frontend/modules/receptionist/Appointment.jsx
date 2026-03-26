// src/frontend/modules/receptionist/Appointment.jsx
// Component for creating and viewing appointments.

import { useState } from "react";

const Appointment = () => {
  const [form, setForm] = useState({
    patientName: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      // TODO: Integrate with AppointmentService (Firestore write)
      console.log("Appointment data:", form);
      setStatus("✅ Appointment scheduled!");
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="appointment-container">
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input name="patientName" placeholder="Patient Name" value={form.patientName} onChange={handleChange} required />
        <input name="doctorId" placeholder="Doctor ID" value={form.doctorId} onChange={handleChange} required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="time" type="time" value={form.time} onChange={handleChange} required />
        <textarea name="reason" placeholder="Reason for Visit" value={form.reason} onChange={handleChange} />
        <button type="submit">Book Appointment</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Appointment;
