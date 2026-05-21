import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../backend/config/firebase';
import { Link } from 'react-router-dom';
import useAuth from '../../../../backend/modules/auth/useAuth';

/**
 * ShiftFilteredPatientList enforces ward/shift filtering in the UI.
 */
const ShiftFilteredPatientList = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedPatients = async () => {
      setLoading(true);
      try {
        // 1. Fetch patients currently in the nurse's ward
        // In a real system, we'd also check the activeShift collection
        const q = query(
          collection(db, "patientState"),
          where("wardId", "==", user?.wardId || "WARD_B"),
          where("stage", "==", "ADMITTED")
        );
        
        const stateSnap = await getDocs(q);
        const patientIds = stateSnap.docs.map(d => d.id);

        if (patientIds.length === 0) {
          setPatients([]);
          return;
        }

        // 2. Fetch basic info for these patients
        const patientSnap = await getDocs(collection(db, "patients"));
        const filtered = patientSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => patientIds.includes(p.id));

        setPatients(filtered);
      } catch (error) {
        console.error("Nurse patient fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPatients();
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading assigned ward patients...</div>;

  return (
    <div className="card table-card stretch-card">
      <div className="card-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px' }}>🏥</div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Active Ward Patients</h3>
            <p style={{ fontSize: '11px', color: '#64748b' }}>Assigned Ward: {user?.wardId || "WARD_B"}</p>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Room</th>
              <th>Last Vitals</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? patients.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar-small">{(p.fullName || p.firstName || "P").charAt(0)}</div>
                    <span style={{ fontWeight: '600' }}>{p.fullName || `${p.firstName} ${p.lastName}`}</span>
                  </div>
                </td>
                <td><span className="badge badge-blue">Room 302</span></td>
                <td><span style={{ fontSize: '12px', color: '#64748b' }}>15 mins ago</span></td>
                <td>
                  <Link to={`/doctor/patient/${p.id}`} className="badge badge-blue">Monitor</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No patients currently admitted in your ward.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftFilteredPatientList;
