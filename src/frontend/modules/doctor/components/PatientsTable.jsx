import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientsTable = ({ patients }) => {
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

  const handleRowClick = (id) => {
    if (!id) {
      alert("Patient data corrupted. Please refresh or contact admin.");
      return;
    }
    navigate(`/doctor/patient/${id}`);
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    if (!id) return;
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (e, actionType, patient) => {
    e.stopPropagation();
    console.log(actionType, patient);
    setActiveDropdown(null);
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, index) => {
            const rowId = p.id || `row-${index}`;
            return (
              <tr 
                key={rowId} 
                className="patient-row"
                onClick={() => handleRowClick(p.id)}
              >
                <td>
                  <div className="table-user">
                    <img src={p.avatar || `https://i.pravatar.cc/150?u=${rowId}`} alt="avatar" className="avatar" />
                    <span>{p.firstName || p.fullName?.split(' ')[0] || 'N/A'}</span>
                  </div>
                </td>
                <td>{p.lastName || p.fullName?.split(' ').slice(1).join(' ') || ''}</td>
                <td>
                  <span className={`status active`}>
                    Active
                  </span>
                </td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="contact-icons">
                    <span className="icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <span className="icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </span>
                  </div>
                </td>
                <td className="item-action" style={{ position: 'relative', overflow: 'visible' }}>
                  <span 
                    onClick={(e) => toggleDropdown(e, rowId)} 
                    style={{ padding: '8px', cursor: 'pointer', display: 'inline-block' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </span>
                  {activeDropdown === rowId && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={(e) => handleAction(e, "Edit", p)}>Edit</div>
                      <div className="dropdown-item" onClick={(e) => handleAction(e, "Delete", p)}>Delete</div>
                    </div>
                  )}
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

export default PatientsTable;
