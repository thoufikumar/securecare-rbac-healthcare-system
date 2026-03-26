import React from 'react';

const AppointmentDetails = ({ data, update }) => {
  return (
    <div className="fade-in">
      <h3 className="section-title-md mb-6">Schedule Initial Appointment</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Doctor Assignment *</label>
            <select className="form-input" value={data.doctorId} onChange={e => update({doctorId: e.target.value})}>
              <option value="">Select Doctor</option>
              <option value="roger">Dr. Roger Curtis (General)</option>
              <option value="hess">Dr. Alex Hess (Cardiology)</option>
              <option value="chen">Dr. Marcus Chen (Surgery)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={data.priority} onChange={e => update({priority: e.target.value})}>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Appointment Date *</label>
            <input 
              type="date" className="form-input" 
              value={data.date} onChange={e => update({date: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Time Slot *</label>
            <select className="form-input" value={data.time} onChange={e => update({time: e.target.value})}>
              <option value="">Select Time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason for Visit</label>
          <textarea 
            className="form-input" 
            rows="3"
            value={data.reason} onChange={e => update({reason: e.target.value})} 
            placeholder="Primary complaint or reason for checkup..."
          ></textarea>
        </div>

      </div>
    </div>
  );
};

export default AppointmentDetails;
