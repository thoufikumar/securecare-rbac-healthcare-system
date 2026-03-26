import React from 'react';

const StatsCards = ({ appointmentsCount, pendingCount }) => {
  return (
    <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
      
      <div className="stat-card interactive-card">
        <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <p className="stat-label" style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Total Patients Today</p>
        <h3 className="stat-value" style={{ fontSize: '28px', color: '#0f172a', margin: 0 }}>{Math.max((appointmentsCount * 0.8).toFixed(0), appointmentsCount === 0 ? 0 : 1)}</h3>
      </div>
      
      <div className="stat-card interactive-card">
        <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#22c55e', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <p className="stat-label" style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Total Appointments</p>
        <h3 className="stat-value" style={{ fontSize: '28px', color: '#0f172a', margin: 0 }}>{appointmentsCount}</h3>
      </div>

      <div className="stat-card interactive-card">
        <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#f97316', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <p className="stat-label" style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Pending Requests</p>
        <h3 className="stat-value" style={{ fontSize: '28px', color: '#0f172a', margin: 0 }}>{pendingCount}</h3>
      </div>

    </div>
  );
};

export default StatsCards;
