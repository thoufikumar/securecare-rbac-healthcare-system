import React from 'react';

const PatientInfoCard = ({ info }) => {
  return (
    <div className="info-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
      <h3 className="section-title-sm mb-6" style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Information:</h3>
      <ul className="info-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Gender</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{info.gender}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Blood Type</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{info.medicalHistory?.bloodGroup || 'N/A'}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Allergies</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{info.medicalHistory?.allergies || 'None'}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Diseases</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{info.medicalHistory?.knownConditions || 'None'}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Location</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', textAlign: 'right' }}>{info.city}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Phone</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{info.phone}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Patient ID</span>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{info.id}</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Registered</span>
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{new Date(info.createdAt).toLocaleDateString()}</span>
        </li>
      </ul>
    </div>
  );
};

export default PatientInfoCard;
