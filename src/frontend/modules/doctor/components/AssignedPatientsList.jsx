import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssignedPatientsList = ({ patients }) => {
  const navigate = useNavigate();

  const handlePatientClick = (id) => {
    navigate(`/doctor/patient/${id}`);
  };

  return (
    <div className="dashboard-card mb-20">
      <div className="card-header">
        <h2>Assigned Patients</h2>
      </div>
      <div className="doctor-table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
        <table className="doctor-table interactive-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Assigned Condition</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} onClick={() => handlePatientClick(p.id)} className="clickable-row">
                <td>
                  <div className="table-user">
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.fullName || p.name || 'P'}`} alt="avatar" />
                    <span>{p.fullName || p.name || "Unknown Patient"}</span>
                  </div>
                </td>
                <td>{p.medicalHistory?.conditions || p.condition || "General Care"}</td>
                <td>
                  <span className={`badge ${p.status === 'Active' ? 'badge-blue' : 'badge-green'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="item-action interactive-icon" onClick={(e) => { e.stopPropagation(); console.log("More options", p.id); }}>...</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan="4" className="empty-text">No assigned patients.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedPatientsList;
