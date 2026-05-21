import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../backend/config/firebase';

/**
 * PatientStatusBanner shows real-time lifecycle state, ward, and room.
 */
const PatientStatusBanner = ({ patientId }) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    
    // Real-time subscription to patientState
    const unsubscribe = onSnapshot(doc(db, "patientState", patientId), (docSnap) => {
      if (docSnap.exists()) {
        setState(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [patientId]);

  if (loading) return <div className="animate-pulse h-16 bg-slate-100 rounded-xl mb-6"></div>;
  if (!state) return null;

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'REGISTERED': return '#94a3b8';
      case 'WAITING': return '#f59e0b';
      case 'CONSULTATION': return '#3b82f6';
      case 'ADMITTED': return '#10b981';
      case 'ICU': return '#ef4444';
      case 'DISCHARGED': return '#6366f1';
      default: return '#64748b';
    }
  };

  return (
    <div className="status-banner fade-in" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', borderRadius: '12px', background: 'white',
      borderLeft: `6px solid ${getStatusColor(state.stage)}`,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Current Stage</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: getStatusColor(state.stage) }}>{state.stage}</span>
        </div>
        
        <div style={{ height: '32px', width: '1px', background: '#e2e8f0' }}></div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Location</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            {state.wardId ? `${state.wardId} • Room ${state.roomId || 'TBD'}` : 'Not Admitted'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Last Updated</span>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{new Date(state.updatedAt).toLocaleTimeString()}</p>
        </div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(state.stage), animation: 'pulse 2s infinite' }}></div>
      </div>
    </div>
  );
};

export default PatientStatusBanner;
