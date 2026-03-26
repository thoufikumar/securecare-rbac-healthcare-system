import React, { useState } from 'react';

const AppointmentsTable = ({ appointments }) => {
  const [activeTab, setActiveTab] = useState('All Appointment');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (e, actionType) => {
    e.stopPropagation();
    console.log(actionType);
    setActiveDropdown(null);
  };

  return (
    <div className="card w-full mt-4" style={{ padding: '0px', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '24px 32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Appointment</h2>
        <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Appointment
        </button>
      </div>
      
      <div className="tabs" style={{ padding: '0 32px', marginBottom: '8px' }}>
        {['All Appointment', 'Upcoming', 'Completed'].map(tab => (
          <button 
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '12px 16px', 
              fontSize: '14px', 
              fontWeight: activeTab === tab ? '600' : '500',
              color: activeTab === tab ? '#2563eb' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table" style={{ borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '16px 32px' }}>Date</th>
              <th>Treatment Type</th>
              <th>Booking Time</th>
              <th>Comments</th>
              <th>Payment</th>
              <th style={{ textAlign: 'right', paddingRight: '32px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {(appointments && appointments.length > 0) ? appointments.map(appt => (
              <tr key={appt.id} className="interactive-row">
                <td style={{ padding: '20px 32px', fontWeight: '500' }}>{new Date(appt.date || appt.createdAt).toLocaleDateString()}</td>
                <td>{appt.treatment || appt.name || 'Regular checkup'}</td>
                <td>{appt.time || '10:00 AM'}</td>
                <td>
                  <span style={{ color: appt.notes ? '#2563eb' : '#94a3b8', textDecoration: appt.notes ? 'underline' : 'none', cursor: appt.notes ? 'pointer' : 'default' }}>
                    {appt.notes || 'No Comments'}
                  </span>
                </td>
                <td>
                  <span className={`payment-status ${appt.paymentStatus || 'complete'}`} style={{ 
                    color: (appt.paymentStatus || 'complete') === 'pending' ? '#f97316' : '#10b981',
                    fontWeight: '600'
                  }}>
                    {appt.paymentStatus || 'Complete'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '32px' }}>
                  <button className="icon-btn-minimal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
