import React from 'react';

const NurseActivity = ({ activities }) => {
  return (
    <div className="dashboard-card stretch-card">
      <div className="card-header">
        <h2>Recent Care Activity</h2>
      </div>
      <div className="doctor-table-wrapper">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Patient</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id} style={{display: 'table-row'}}>
                <td>{act.action}</td>
                <td>{act.patientName}</td>
                <td>{act.time}</td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr><td colSpan="3" className="empty-text">No recent care activity.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseActivity;
