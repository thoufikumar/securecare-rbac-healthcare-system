import React from 'react';

const PersonalDetails = ({ data, update }) => {
  
  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / 31557600000);
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    update({ dob, age: calculateAge(dob) });
  };

  return (
    <div className="fade-in">
      <h3 className="section-title-md mb-6">Patient Personal Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input 
            type="text" className="form-input" 
            value={data.firstName} onChange={e => update({firstName: e.target.value})} 
            placeholder="John"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input 
            type="text" className="form-input" 
            value={data.lastName} onChange={e => update({lastName: e.target.value})} 
            placeholder="Doe"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-input" value={data.gender} onChange={e => update({gender: e.target.value})}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
          <div>
            <label className="form-label">Date of Birth</label>
            <input 
              type="date" className="form-input" 
              value={data.dob} onChange={handleDobChange} 
            />
          </div>
          <div>
            <label className="form-label">Age</label>
            <input 
              type="number" className="form-input" 
              value={data.age} disabled 
              style={{ background: '#f8fafc', cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
