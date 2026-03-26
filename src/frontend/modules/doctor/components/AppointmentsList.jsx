import React, { useState } from 'react';

const AppointmentsList = ({ appointments }) => {
  const [activeDate, setActiveDate] = useState(21);
  const dates = [
    { day: 'Sun', num: 20 },
    { day: 'Mon', num: 21 },
    { day: 'Tue', num: 22 },
    { day: 'Wed', num: 23 },
    { day: 'Thu', num: 24 },
    { day: 'Fri', num: 25 },
    { day: 'Sat', num: 26 },
  ];

  const handleAppointmentClick = (app) => {
    console.log("Clicked appointment for:", app.patientName, "on id:", app.id);
  };

  return (
    <div className="dashboard-card mb-20">
      <div className="card-header">
        <h2>Today's Appointments</h2>
        <span className="see-all interactive-text">See All</span>
      </div>
      <div className="dates-row">
        {dates.map((d, i) => (
          <div 
            key={i} 
            className={`date-item interactive-btn ${activeDate === d.num ? 'active' : ''}`}
            onClick={() => setActiveDate(d.num)}
          >
            <span>{d.day}</span>
            <strong>{d.num}</strong>
          </div>
        ))}
      </div>
      <div className="list-items">
        {appointments.map(app => (
          <div key={app.id} className="list-item interactive-list-item" onClick={() => handleAppointmentClick(app)}>
            <div className="item-avatar"><img src={app.avatar || `https://ui-avatars.com/api/?name=${app.patientName || app.fullName || 'P'}`} alt="avatar" /></div>
            <div className="item-details">
              <h4>{app.patientName || app.fullName || "Unknown Patient"}</h4>
              <p>{app.type || "Medical Visit"}</p>
            </div>
            <div className="item-time">
              <p>{app.time}</p>
            </div>
            <div className="item-action interactive-icon">...</div>
          </div>
        ))}
        {appointments.length === 0 && <p className="empty-text">No appointments for today.</p>}
      </div>
    </div>
  );
};

export default AppointmentsList;
