import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepForm from './components/StepForm';

const PatientRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="doctor-dashboard-wrapper fade-in" style={{ padding: '0px' }}>
      <div className="doctor-header-banner" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
        <div className="header-greeting">
          <button
            onClick={() => navigate('/receptionist')}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px', fontSize: '14px', opacity: 0.8 }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ color: "white", marginBottom: "8px", border: "none" }}>Patient Registration</h1>
          <p style={{ color: "rgba(255,255,255,0.9)" }}>Register a new patient and book their initial appointment.</p>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <StepForm />
      </div>
    </div>
  );
};

export default PatientRegistration;
