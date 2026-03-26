import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <div className="doctor-header-banner">
      <div className="header-greeting">
        <h1 style={{ color: "white", marginBottom: "8px", border: "none" }}>Hello Doctor 👋</h1>
        <p style={{ color: "rgba(255,255,255,0.9)" }}>Welcome back. Here's your patient overview.</p>
      </div>
    </div>
  );
};

export default HeaderSection;
