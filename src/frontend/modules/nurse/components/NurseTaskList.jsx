import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NurseTaskList = ({ tasks, onMarkDone }) => {
  const navigate = useNavigate();
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

  return (
    <div className="dashboard-card mb-20">
      <div className="card-header">
        <h2>Today's Care Tasks</h2>
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
        {tasks.map(task => (
          <div key={task.id} className="list-item interactive-list-item">
            <div className="item-avatar"><img src={task.avatar || `https://ui-avatars.com/api/?name=${task.patientName || 'P'}`} alt="avatar" /></div>
            <div className="item-details" onClick={() => navigate(`/nurse/patient/${task.patientId}`)} style={{ cursor: 'pointer' }}>
              <h4>{task.patientName || "Unknown Patient"}</h4>
              <p>
                {task.type} 
                <span className={`badge ${task.priority === 'Urgent' ? 'badge-danger' : 'badge-blue'}`} style={{ marginLeft: '8px', fontSize: '10px', padding: '2px 8px' }}>{task.priority}</span>
                {task.appointmentId && (
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '8px' }}>Ref: {task.appointmentId.slice(-6).toUpperCase()}</span>
                )}
              </p>
            </div>
            <div className="item-time">
              <p>{task.time}</p>
            </div>
            <div className="item-action">
              <button 
                className="btn-primary" 
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => onMarkDone(task.id)}
              >
                Mark Done
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="empty-text">No care tasks assigned for today.</p>}
      </div>
    </div>
  );
};

export default NurseTaskList;
