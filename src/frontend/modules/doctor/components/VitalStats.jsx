import React from 'react';

const VitalStats = ({ vitals, onUpdate }) => {
  return (
    <div className="prescription-section" style={{ padding: '24px' }}>
      <div className="flex-between mb-6" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
        <h3 className="section-title-md" style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Vital Signs</h3>
        <button
          className="icon-btn-minimal"
          onClick={onUpdate}
          style={{ padding: '6px 12px', fontSize: '12px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontWeight: '600' }}
        >
          Update Vitals
        </button>
      </div>

      <div className="vital-stats">
        <div className="vital-card">
          <div className="stat-icon-wrapper" style={{ color: '#ef4444', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h4 className="v-stat-title" style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Heart Rate</h4>
          <div className="v-stat-value" style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {vitals?.heartRate || '80'}<span style={{ fontSize: '12px', fontWeight: '500', marginLeft: '2px' }}>bpm</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="stat-icon-wrapper" style={{ color: '#f59e0b', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
          </div>
          <h4 className="v-stat-title" style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Body Temperature</h4>
          <div className="v-stat-value" style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {vitals?.temperature || '36.5'}<span style={{ fontSize: '12px', fontWeight: '500', marginLeft: '2px' }}>°c</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="stat-icon-wrapper" style={{ color: '#2563eb', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <h4 className="v-stat-title" style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Glucose</h4>
          <div className="v-stat-value" style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {vitals?.glucose || '100'}<span style={{ fontSize: '12px', fontWeight: '500', marginLeft: '2px' }}>mg/dl</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalStats;
