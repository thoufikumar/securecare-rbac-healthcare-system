import React from 'react';

const RecentActivityList = ({ activities }) => {
  return (
    <div className="activity-list-container">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <div className="activity-left">
            <div className="activity-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="activity-details">
              <span className="activity-title">{activity.action}</span>
            </div>
          </div>
          <div className="activity-middle">
            <span className="activity-patient">
              <img src={`https://i.pravatar.cc/150?u=${activity.avatar}`} alt="Avatar" className="activity-avatar" />
              {activity.patient}
            </span>
          </div>
          <div className="activity-right">
            <span className="activity-time">{activity.time}</span>
            <button className="icon-btn" onClick={() => console.log('Action', activity.action)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;
