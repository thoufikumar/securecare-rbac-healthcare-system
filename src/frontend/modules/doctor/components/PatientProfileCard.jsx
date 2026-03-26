import React from 'react';

const PatientProfileCard = ({ patient, variant = "detail" }) => {
  if (variant === "appointment") {
    return (
      <div className="profile-card appt-profile-card">
        <img src={patient.avatar || "https://ui-avatars.com/api/?name=Patient"} alt="Profile" className="profile-avatar-lg" style={{ width: '100px', height: '100px', borderRadius: '16px', marginBottom: '16px', objectFit: 'cover', border: '3px solid #eff6ff' }} />
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>{patient.firstName} {patient.lastName}</h3>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Age: {patient.age || 'N/A'}</p>
        <button className="primary-btn mt-4 w-full" style={{ padding: '12px', borderRadius: '12px', fontWeight: '600' }} onClick={() => console.log('Update')}>Update Profile</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={patient.avatar}
        alt={patient.name}
        style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover', border: '3px solid #eff6ff' }}
      />
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>{patient.name}</h3>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>{patient.email}</p>

      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '32px', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Appointments</p>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{patient.appointmentsCount}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Billing</p>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>${patient.totalBilling}</span>
        </div>
      </div>

      <button className="btn-secondary w-full" style={{ padding: '10px', borderRadius: '12px', fontWeight: '600' }}>
        Send Message
      </button>
    </div>
  );
};

export default PatientProfileCard;
