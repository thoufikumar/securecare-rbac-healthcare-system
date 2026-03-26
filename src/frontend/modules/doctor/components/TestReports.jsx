import React from 'react';

const REPORTS = [
  { id: 1, title: 'CT Scan - Full Body', date: '12th February 2020', type: 'scanner' },
  { id: 2, title: 'Creatine Kinase T', date: '12th February 2020', type: 'lab' },
  { id: 3, title: 'Eye Fluorescein Test', date: '12th February 2020', type: 'eye' }
];

const TestReports = () => {
  return (
    <div className="prescription-section" style={{ padding: '24px' }}>
      <h3 className="section-title-md mb-6" style={{ fontSize: '16px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Test Reports</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {REPORTS.map(rep => (
          <div key={rep.id} className="report-card" style={{ border: '1px solid #f1f5f9' }}>
            <div className="report-icon-sm" style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <div className="report-details">
              <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{rep.title}</h4>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{rep.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestReports;
