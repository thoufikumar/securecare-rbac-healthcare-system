import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalDetails from './PersonalDetails';
import ContactDetails from './ContactDetails';
import AppointmentDetails from './AppointmentDetails';

import { addPatient } from '../../../../backend/modules/patient/PatientService';
import { createAppointment } from '../../../../backend/modules/appointment/AppointmentService';
import { transition } from '../../../../backend/modules/state/StateService';
import useAuth from '../../../../backend/modules/auth/useAuth';

export const registerPatientWithAppointment = async (data, user) => {
  try {
    // 1. Create patient via secure service (Basic Info Only)
    const patientData = {
      firstName: data.personal.firstName,
      lastName: data.personal.lastName,
      fullName: `${data.personal.firstName} ${data.personal.lastName}`,
      age: data.personal.age,
      gender: data.personal.gender,
      bloodGroup: data.medical.bloodGroup,
      contactNumber: data.contact.phone,
      address: `${data.contact.address}, ${data.contact.city}, ${data.contact.state} ${data.contact.zipCode}`,
      // Clinical initialization is now handled by the Doctor during first consultation
      medicalHistory: {
        conditions: "Initialized on first visit",
        allergies: "TBD",
        history: ""
      },
      assignedDoctorId: data.appointment.doctorId
    };

    const patientId = await addPatient(patientData, user);

    // 2. Initialize Extended State (Intake Pending + Doctor Assignment)
    await transition(patientId, "REGISTERED", user, { 
      intakeStatus: "PENDING",
      assignedDoctorId: data.appointment.doctorId
    });

    // 3. Create appointment mapping
    await createAppointment({
      patientId: patientId,
      patientName: patientData.fullName,
      doctorId: data.appointment.doctorId,
      date: data.appointment.date,
      time: data.appointment.time,
      reason: data.appointment.reason,
      priority: data.appointment.priority,
      status: "upcoming"
    }, user);

    return patientId;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const StepForm = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', gender: '', dob: '', age: '' },
    contact: { phone: '', email: '', address: '', city: '', state: '', zipCode: '' },
    medical: { bloodGroup: '' }, // Minimized for receptionist
    appointment: { doctorId: '', date: '', time: '', reason: '', priority: 'Normal' }
  });

  const updateData = (section, fields) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...fields }
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const patientId = await registerPatientWithAppointment(formData, user);
      alert("Patient registered successfully! Moving to Secure Intake Form...");
      navigate(`/intake/${patientId}`);
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Personal", "Contact", "Appointment"];

  return (
    <div className="dashboard-card fade-in" style={{ padding: '32px' }}>

      {/* Stepper Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '15px', left: '0', width: `${((step - 1) / 2) * 100}%`, height: '2px', background: '#3b82f6', zIndex: 0, transition: 'width 0.3s' }}></div>

        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step >= stepNum;
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isActive ? '#3b82f6' : '#fff',
                border: `2px solid ${isActive ? '#3b82f6' : '#cbd5e1'}`,
                color: isActive ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px', marginBottom: '8px',
                transition: 'all 0.3s'
              }}>
                {step > stepNum ? '✓' : stepNum}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '400', color: isActive ? '#0f172a' : '#64748b' }}>{label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ minHeight: '300px', marginBottom: '32px' }}>
        {step === 1 && <PersonalDetails data={formData.personal} update={(d) => updateData('personal', d)} />}
        {step === 2 && <ContactDetails data={formData.contact} update={(d) => updateData('contact', d)} />}
        {step === 3 && <AppointmentDetails data={formData.appointment} update={(d) => updateData('appointment', d)} />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
        <button
          className="btn-secondary"
          onClick={prevStep}
          disabled={step === 1}
          style={{ padding: '10px 24px', opacity: step === 1 ? 0.5 : 1 }}
        >
          Back
        </button>

        {step < 3 ? (
          <button className="primary-btn" onClick={nextStep} style={{ padding: '10px 24px' }}>Continue</button>
        ) : (
          <button className="primary-btn" onClick={handleSubmit} disabled={loading} style={{ padding: '10px 24px', background: '#10b981' }}>
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        )}
      </div>

      <div style={{ marginTop: '24px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: 0 }}>
          🛡️ <strong>Note:</strong> Clinical data (History, Allergies, Vitals) can only be added by a Licensed Physician during the consultation.
        </p>
      </div>

    </div>
  );
};

export default StepForm;
