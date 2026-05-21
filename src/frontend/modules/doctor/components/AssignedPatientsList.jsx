import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignedPatientsList = ({ patients, onAction }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdown when clicking anywhere else
  React.useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [activeDropdown]);

  const handlePatientClick = (id) => {
    if (!id) {
      console.error("Cannot navigate: Patient ID is missing");
      return;
    }
    navigate(`/doctor/patient/${id}`);
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (e, actionType, patient) => {
    e.stopPropagation();
    if (onAction) {
      onAction(actionType, patient);
    }
    setActiveDropdown(null);
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
              <th>Condition</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} onClick={() => handlePatientClick(p.id)} className="clickable-row">
                <td>
                  <div className="table-user">
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName || p.name || 'P')}&background=random&color=fff`} alt="avatar" />
                    <span>{p.fullName || p.name || "Unknown Patient"}</span>
                  </div>
                </td>
                <td>{p.medicalHistory?.conditions?.[0] || p.condition || "General Care"}</td>
                <td>
                  <span className={`badge ${p.status === 'Active' ? 'badge-blue' : 'badge-green'}`}>
                    {p.status || 'Active'}
                  </span>
                </td>
                <td className="item-action" style={{ position: 'relative', overflow: 'visible' }}>
                  <span 
                    onClick={(e) => toggleDropdown(e, p.id)} 
                    style={{ padding: '8px', cursor: 'pointer', display: 'inline-block' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </span>
                  {activeDropdown === p.id && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={(e) => handleAction(e, "Edit", p)}>Edit</div>
                      <div className="dropdown-item" onClick={(e) => handleAction(e, "Delete", p)}>Delete</div>
                    </div>
                  )}
                </td>
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
