import React from 'react';

const PatientInfoGrid = ({ info }) => {
  const fields = [
    { label: 'Gender', value: info.gender },
    { label: 'Birth Date', value: info.dob },
    { label: 'City', value: info.city },
    { label: 'Phone', value: info.phone },
    { label: 'Zip Code', value: info.zipCode },
    { label: 'Address', value: info.address },
    { label: 'Status', value: info.status },
    { label: 'Register Date', value: info.registerDate },
  ];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px', height: '100%', alignContent: 'center' }}>
        {fields.map((f, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{f.label}</span>
            <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientInfoGrid;
