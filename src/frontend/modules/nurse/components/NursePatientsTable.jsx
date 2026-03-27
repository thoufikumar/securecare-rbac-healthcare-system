import React from 'react';
import { useNavigate } from 'react-router-dom';

const NursePatientsTable = ({ patients }) => {
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/nurse/patient/${id}`);
  };

  return (
    <div className="table-responsive">
      <table className="patient-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => {
            return (
              <tr 
                key={p.id} 
                className="patient-row clickable-row"
                onClick={() => handleRowClick(p.id)}
              >
                <td>
                  <div className="table-user">
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.firstName || 'P'}`} alt="avatar" className="avatar" />
                    <span>{p.firstName || "Unknown"}</span>
                  </div>
                </td>
                <td>{p.lastName || ""}</td>
                <td>
                  <span className={`status active`}>
                    Active
                  </span>
                </td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="contact-icons">
                    <span className="icon">📞</span>
                    <span className="icon">✉️</span>
                  </div>
                </td>
                <td>
                   <button className="badge-outline" style={{ cursor: 'pointer' }}>View Care Plan</button>
                </td>
              </tr>
            );
          })}
          {patients.length === 0 && (
            <tr>
              <td colSpan="6" className="empty-text">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NursePatientsTable;
