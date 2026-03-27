import React from 'react';

const NurseHeader = () => {
  return (
    <div className="doctor-header-banner">
      <div className="header-greeting">
        <h1 style={{ color: "white", marginBottom: "8px", border: "none" }}>Hello Nurse 👋</h1>
        <p style={{ color: "rgba(255,255,255,0.9)" }}>Here’s your assigned care tasks and patient status.</p>
      </div>
    </div>
  );
};

export default NurseHeader;
