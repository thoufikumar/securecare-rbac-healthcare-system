import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentTable = ({ appointments }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <span className="badge" style={{background: '#fef3c7', color: '#d97706'}}>Pending</span>;
      case 'confirmed':
        return <span className="badge badge-blue">Confirmed</span>;
      case 'completed':
        return <span className="badge badge-green">Completed</span>;
      default:
        return <span className="badge">{status || 'Unknown'}</span>;
    }
  };

  const getIntakeBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="badge" style={{background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5'}}>🟡 Intake Pending</span>;
      case 'COMPLETED':
        return <span className="badge" style={{background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7'}}>🟢 Intake Completed</span>;
      default:
        return <span className="badge" style={{background: '#f8fafc', color: '#64748b'}}>N/A</span>;
    }
  };

  return (
    <div className="dashboard-card stretch-card mb-20">
      <div className="card-header">
        <h2>Live Appointments</h2>
        <div className="header-tools">
          <span className="interactive-btn" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #e5e7eb', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', color: '#6b7280'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
        </div>
      </div>
      <div className="doctor-table-wrapper">
        <table className="doctor-table interactive-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Appointment ID</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Intake</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td style={{ fontWeight: '500', color: '#1e293b' }}>{app.personal?.firstName ? `${app.personal.firstName} ${app.personal.lastName}` : (app.patientId ? `PTR-${app.patientId.slice(0,6).toUpperCase()}` : 'Walk-in')}</td>
                <td style={{ color: '#64748b' }}>APT-{app.id.slice(0,5).toUpperCase()}</td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{getStatusBadge(app.status)}</td>
                <td>{getIntakeBadge(app.intakeStatus)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {app.intakeStatus === 'PENDING' && (
                      <button 
                        className="primary-btn" 
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                        onClick={() => navigate(`/intake/${app.patientId}`)}
                      >
                        Complete Intake
                      </button>
                    )}
                    <button className="icon-btn-minimal" title="Details" onClick={() => navigate(`/doctor/patient/${app.patientId}`)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan="7" className="empty-text">No active appointments found. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
