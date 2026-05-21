import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../../backend/config/firebase';

/**
 * SecurityInsightsPanel provides a high-level view of system security health.
 * Shows anomalies and access patterns WITHOUT revealing clinical data.
 */
const SecurityInsightsPanel = () => {
  const [stats, setStats] = useState({
    totalAccessEvents: 0,
    emergencyAccessCount: 0,
    outOfShiftViolations: 0,
    anomalies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityStats = async () => {
      setLoading(true);
      try {
        const auditSnap = await getDocs(query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(100)));
        const logs = auditSnap.docs.map(d => d.data());

        const emergency = logs.filter(l => l.reason === 'EMERGENCY').length;
        const violations = logs.filter(l => l.action?.includes('VIOLATION')).length;

        setStats({
          totalAccessEvents: logs.length,
          emergencyAccessCount: emergency,
          outOfShiftViolations: violations,
          anomalies: logs.filter(l => l.severity === 'high').slice(0, 3)
        });
      } catch (error) {
        console.error("Security stats fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityStats();
  }, []);

  return (
    <div className="card" style={{ padding: '24px', background: '#0f172a', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: '#60a5fa' }}>🛡️</div>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Security Health Monitor</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>Emergency Decryptions</p>
          <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>{stats.emergencyAccessCount}</h4>
        </div>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>Security Violations</p>
          <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444' }}>{stats.outOfShiftViolations}</h4>
        </div>
      </div>

      <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', opacity: 0.8 }}>Top Security Risks</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stats.anomalies.length > 0 ? stats.anomalies.map((a, i) => (
          <div key={i} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#fca5a5', margin: 0 }}>{a.action?.replace(/_/g, ' ')}</p>
            <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{a.performedBy?.email || 'Unknown User'}</p>
          </div>
        )) : (
          <p style={{ fontSize: '12px', opacity: 0.5, textAlign: 'center', padding: '20px' }}>No high-priority anomalies detected.</p>
        )}
      </div>
    </div>
  );
};

export default SecurityInsightsPanel;
