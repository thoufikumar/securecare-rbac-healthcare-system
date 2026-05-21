import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../../backend/config/firebase';

/**
 * PatientTimeline displays a chronological feed of append-only clinical records and nurse logs.
 */
const PatientTimeline = ({ patientId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchTimeline = async () => {
      setLoading(true);
      try {
        // Fetch from multiple append-only collections
        const [clinicalSnap, nurseSnap] = await Promise.all([
          getDocs(query(collection(db, "clinicalRecords"), where("patientId", "==", patientId), orderBy("timestamp", "desc"), limit(20))),
          getDocs(query(collection(db, "nurseLogs"), where("patientId", "==", patientId), orderBy("timestamp", "desc"), limit(20)))
        ]);

        const clinicalRecords = clinicalSnap.docs.map(d => ({ ...d.data(), id: d.id, SOURCE: 'DOCTOR' }));
        const nurseLogs = nurseSnap.docs.map(d => ({ ...d.data(), id: d.id, SOURCE: 'NURSE' }));

        // Combine and sort
        const combined = [...clinicalRecords, ...nurseLogs].sort((a, b) => 
          (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );

        setEntries(combined);
      } catch (error) {
        console.error("Timeline fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [patientId]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading timeline history...</div>;

  return (
    <div className="timeline-container" style={{ position: 'relative', paddingLeft: '24px' }}>
      {/* Center Line */}
      <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }}></div>

      {entries.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: '14px', paddingTop: '10px' }}>No clinical history found for this patient.</div>
      ) : (
        entries.map((entry, idx) => (
          <div key={entry.id} className="timeline-entry fade-in" style={{ position: 'relative', marginBottom: '32px' }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: '-29px', top: '4px', width: '12px', height: '12px', borderRadius: '50%',
              background: entry.SOURCE === 'DOCTOR' ? '#3b82f6' : '#10b981',
              border: '2px solid white', boxShadow: '0 0 0 4px #f8fafc'
            }}></div>

            <div className="card" style={{ padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: entry.SOURCE === 'DOCTOR' ? '#3b82f6' : '#10b981', textTransform: 'uppercase' }}>
                  {entry.SOURCE === 'DOCTOR' ? 'Diagnosis & Action' : 'Bedside Care'}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {entry.timestamp ? new Date(entry.timestamp.seconds * 1000).toLocaleString() : 'Recent'}
                </span>
              </div>

              {entry.SOURCE === 'DOCTOR' ? (
                <>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '4px 0' }}>{entry.visitType || 'Consultation'}</p>
                  <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>Diagnosis: Masked • Provide Reason to Reveal</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '4px 0' }}>{entry.taskName || 'Routine Nursing'}</p>
                  <p style={{ fontSize: '13px', color: '#475569' }}>{entry.notes ? 'Bedside notes recorded.' : 'Vitals logged.'}</p>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientTimeline;
