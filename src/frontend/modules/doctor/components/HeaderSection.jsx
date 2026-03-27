import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../backend/modules/auth/useAuth';

const HeaderSection = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const doctorName = user?.email?.split('@')[0] || "Doctor";

  return (
    <div className="doctor-header-banner">
      <div className="header-greeting">
        <h1 style={{ color: "white", marginBottom: "8px", border: "none" }}>Hello {doctorName} 👋</h1>
        <p style={{ color: "rgba(255,255,255,0.9)" }}>Welcome back. Here's your patient overview.</p>
      </div>
    </div>
  );
};

export default HeaderSection;
