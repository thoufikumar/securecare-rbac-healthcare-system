import React, { useEffect, useState } from "react";
import { getDoctors } from "../../../backend/modules/doctor/DoctorService";
import { getAllPatients } from "../../../backend/modules/patient/PatientService";
import { createAppointment } from "../../../backend/modules/appointment/AppointmentService";
import useAuth from "../../../backend/modules/auth/useAuth";

const Appointment = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    treatmentType: "General Consultation"
  });
  const [status, setStatus] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, pats] = await Promise.all([
          getDoctors(),
          getAllPatients()
        ]);
        setDoctors(docs);
        setPatients(pats);
      } catch (err) {
        console.error("Error fetching appointment data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await createAppointment(form, user);
      setStatus("✅ Appointment scheduled!");
      setForm({
        patientId: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        treatmentType: "General Consultation"
      });
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="appointment-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-soft)' }}>
      <h2 className="section-title-md mb-8">Schedule New Appointment</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div className="form-group">
          <label className="form-label">Select Patient</label>
          <select name="patientId" className="form-input" value={form.patientId} onChange={handleChange} required>
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.fullName || `${p.firstName} ${p.lastName}`}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Assign Doctor</label>
          <select name="doctorId" className="form-input" value={form.doctorId} onChange={handleChange} required>
            <option value="">-- Choose Doctor --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name || d.email} ({d.department})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input name="date" type="date" className="form-input" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input name="time" type="time" className="form-input" value={form.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Treatment Type</label>
          <select name="treatmentType" className="form-input" value={form.treatmentType} onChange={handleChange} required>
             <option value="General Consultation">General Consultation</option>
             <option value="Specialist Review">Specialist Review</option>
             <option value="Follow-up">Follow-up</option>
             <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notes / Reason</label>
          <textarea name="reason" placeholder="Reason for Visit" className="form-input" value={form.reason} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="primary-btn" style={{ padding: '14px', borderRadius: '12px' }}>Book Appointment</button>
      </form>
      {status && (
        <div className={`status-message mt-6 p-4 rounded-lg text-center ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default Appointment;
