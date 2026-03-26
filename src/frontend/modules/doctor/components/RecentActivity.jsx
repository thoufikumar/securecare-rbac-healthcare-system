import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="dashboard-card stretch-card">
      <div className="card-header">
        <h2>Recent Activity</h2>
      </div>
      <div className="doctor-table-wrapper">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Patient</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id} className="interactive-list-item" style={{display: 'table-row'}}>
                <td>{act.action}</td>
                <td>{act.patientName}</td>
                <td>{act.time}</td>
                <td className="item-action interactive-icon">...</td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr><td colSpan="4" className="empty-text">No recent activity.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
