import React from 'react';

const StatsCards = ({ appointmentsCount, patientsCount, reviewsCount }) => {
  return (
    <div className="stats-grid section">
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon blue-icon">📅</div>
        <div className="card-info">
          <h3>Today's Appointments</h3>
          <p className="metric-value">{appointmentsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon red-icon">❤️</div>
        <div className="card-info">
          <h3>Assigned Patients</h3>
          <p className="metric-value">{patientsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="dashboard-card summary-card interactive-card">
        <div className="card-icon blue-icon">📝</div>
        <div className="card-info">
          <h3>Pending Reviews</h3>
          <p className="metric-value">{reviewsCount.toString().padStart(2, '0')}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
