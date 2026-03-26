import React from 'react';

const AppointmentTable = ({ appointments }) => {

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
              <th>Doctor Assigned</th>
              <th>Status</th>
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
                <td>{app.doctorId ? `Doc-${app.doctorId}` : 'Any Available'}</td>
                <td>{getStatusBadge(app.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn-minimal" title="Approve" style={{ color: '#10b981' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button className="icon-btn-minimal" title="Reject" style={{ color: '#ef4444' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
