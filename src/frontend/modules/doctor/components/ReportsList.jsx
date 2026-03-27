import React from 'react';

const ReportsList = ({ reports }) => {
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between mb-6">
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Reports</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {reports.length > 0 ? reports.map(report => (
          <div key={report.id} className="report-item" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '2px' }}>{report.title}</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Date - {report.date}</p>
            </div>
            <div className="report-actions" style={{ display: 'flex', gap: '8px' }}>
              <button className="icon-btn-minimal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
              <button className="icon-btn-minimal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
        )) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No reports available
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;
