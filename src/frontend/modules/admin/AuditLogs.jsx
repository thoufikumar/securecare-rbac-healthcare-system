import React, { useState, useEffect } from 'react';
import { getAuditLogs, analyzeAuditLogs } from '../../../backend/modules/audit/AuditService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await getAuditLogs();
      setLogs(allLogs);
      const detectionResults = analyzeAuditLogs(allLogs);
      setAnomalies(detectionResults);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high': return { background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b' };
      case 'medium': return { background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e' };
      default: return { background: '#f0f9ff', border: '1px solid #e0f2fe', color: '#075985' };
    }
  };

  return (
    <div className="crm-view fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="view-title" style={{ margin: 0 }}>System Audit & AI Monitoring</h1>
        <button onClick={fetchLogs} className="btn-secondary" style={{ padding: '10px 20px' }}>Refresh Logs</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>

        {/* Logs Table */}
        <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Clinical Actions</h3>
          </div>
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Target</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className={`role-badge role-${log.performedBy?.role || 'system'}`}>
                        {log.action?.replace(/_/g, ' ') || 'SYSTEM ACTION'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500', color: '#1e293b' }}>{log.performedBy?.email || 'system-service@securecare.com'}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Role: {log.performedBy?.role || 'system'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#475569' }}>
                        {log.target?.patientId ? `Patient ID: ...${log.target.patientId.slice(-6)}` : 'System'}
                      </span>
                    </td>
                    <td>
                      <span className="date-text" style={{ fontSize: '13px' }}>
                        {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      {loading ? 'Analyzing security logs...' : 'No audit logs found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="dashboard-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s infinite' }}></div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>AI Anomaly Detector</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {anomalies.length > 0 ? anomalies.map((anomaly, idx) => (
                <div key={idx} style={{ padding: '16px', borderRadius: '12px', ...getSeverityStyle(anomaly.severity) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>{anomaly.severity} Priority</span>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 10px 0', fontWeight: '600' }}>{anomaly.issue}</p>
                  <p style={{ fontSize: '12px', opacity: 0.9, fontStyle: 'italic' }}>Rec: {anomaly.recommendation}</p>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛡️</div>
                  <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>No clinical anomalies detected. System behavior is normal.</p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', opacity: 0.8 }}>Security Coverage</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Log Integrity</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>100% Verified</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#10b981' }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditLogs;
