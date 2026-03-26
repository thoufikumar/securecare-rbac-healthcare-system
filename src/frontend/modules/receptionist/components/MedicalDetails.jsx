import React from 'react';

const MedicalDetails = ({ data, update }) => {
  return (
    <div className="fade-in">
      <h3 className="section-title-md mb-6">Medical Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Blood Group *</label>
            <select className="form-input" value={data.bloodGroup} onChange={e => update({bloodGroup: e.target.value})}>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Allergies</label>
            <input 
              type="text" className="form-input" 
              value={data.allergies} onChange={e => update({allergies: e.target.value})} 
              placeholder="e.g. Penicillin, Peanuts (or 'None')"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Known Conditions</label>
          <input 
            type="text" className="form-input" 
            value={data.knownConditions} onChange={e => update({knownConditions: e.target.value})} 
            placeholder="e.g. Asthma, Diabetes"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Previous Medical History</label>
          <textarea 
            className="form-input" 
            rows="4"
            value={data.previousHistory} onChange={e => update({previousHistory: e.target.value})} 
            placeholder="Briefly describe any past surgeries, chronic conditions, etc."
          ></textarea>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            ℹ️ This data will be encrypted securely before storage in compliance with data policies.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MedicalDetails;
