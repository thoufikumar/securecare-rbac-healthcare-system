import React from 'react';

const ContactDetails = ({ data, update }) => {
  return (
    <div className="fade-in">
      <h3 className="section-title-md mb-6">Contact & Location</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input 
            type="tel" className="form-input" 
            value={data.phone} onChange={e => update({phone: e.target.value})} 
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" className="form-input" 
            value={data.email} onChange={e => update({email: e.target.value})} 
            placeholder="patient@example.com"
          />
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Street Address</label>
          <input 
            type="text" className="form-input" 
            value={data.address} onChange={e => update({address: e.target.value})} 
            placeholder="123 Main St, Apt 4B"
          />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <input 
            type="text" className="form-input" 
            value={data.city} onChange={e => update({city: e.target.value})} 
            placeholder="New York"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">State</label>
            <input 
              type="text" className="form-input" 
              value={data.state} onChange={e => update({state: e.target.value})} 
              placeholder="NY"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Zip Code</label>
            <input 
              type="text" className="form-input" 
              value={data.zipCode} onChange={e => update({zipCode: e.target.value})} 
              placeholder="10001"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
