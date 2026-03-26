import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="doctor-header-banner">
      <div className="header-greeting">
        <h1 style={{ color: "white", marginBottom: "8px", border: "none" }}>Welcome, Receptionist 👋</h1>
        <p style={{ color: "rgba(255,255,255,0.9)" }}>Manage appointments and patient registrations.</p>
      </div>
      <div className="header-actions-btn" style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="btn-white interactive-btn" 
          onClick={() => navigate('/receptionist/register')} 
          style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Add Patient / Book
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
