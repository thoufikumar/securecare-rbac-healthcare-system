import React from 'react';

const NurseStats = ({ patientsCount, tasksCount, vitalsCount, medsCount }) => {
  return (
    <div className="stats-grid section">
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon red-icon">❤️</div>
        <div className="card-info">
          <h3>Patients Assigned</h3>
          <p className="metric-value">{patientsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon blue-icon">⏳</div>
        <div className="card-info">
          <h3>Pending Tasks</h3>
          <p className="metric-value">{tasksCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon blue-icon">🌡️</div>
        <div className="card-info">
          <h3>Vitals to Record</h3>
          <p className="metric-value">{vitalsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon blue-icon">💊</div>
        <div className="card-info">
          <h3>Medications Due</h3>
          <p className="metric-value">{medsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
    </div>
  );
};

export default NurseStats;
