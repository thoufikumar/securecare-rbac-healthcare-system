import React from 'react';
import { useNavigate } from 'react-router-dom';

const NurseCareList = ({ patients }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-card mb-20">
      <div className="card-header">
        <h2>Patients Under Care</h2>
      </div>
      <div className="doctor-table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Care Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} onClick={() => navigate(`/nurse/patient/${p.id}`)} className="clickable-row">
                <td>
                  <div className="table-user">
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.fullName || p.name || 'P'}`} alt="avatar" />
                    <span>{p.fullName || p.name || "Unknown Patient"}</span>
                  </div>
                </td>
                <td>{p.careType || "Routine Monitoring"}</td>
                <td>
                  <span className={`badge ${p.status === 'Critical' ? 'badge-danger' : 'badge-green'}`}>
                    {p.status || 'Stable'}
                  </span>
                </td>
                <td>
                   <button className="badge-outline" style={{ fontSize: '11px', cursor: 'pointer' }}>View</button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan="4" className="empty-text">No patients under care.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseCareList;
