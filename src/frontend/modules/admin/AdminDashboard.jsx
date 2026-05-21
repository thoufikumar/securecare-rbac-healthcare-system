import React, { useState, useEffect } from "react";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "../../../backend/config/firebase";
import SecurityInsightsPanel from "./components/SecurityInsightsPanel";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    doctors: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userSnap, patientSnap, doctorSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "patients")),
          getDocs(collection(db, "doctors"))
        ]);
        
        setStats({
          users: userSnap.size,
          patients: patientSnap.size,
          doctors: doctorSnap.size
        });

        // Get 10 most recent patients
        const patients = patientSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
        
        setRecentPatients(patients);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="crm-view fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="view-title" style={{ margin: 0 }}>Administrative Control</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-blue">System Active</div>
          <div className="badge badge-green">Security Verified</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        
        <div>
          <div className="dashboard-metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div className="card metric-card">
              <h3>System Users</h3>
              <p className="metric-value">{stats.users}</p>
            </div>
            <div className="card metric-card">
              <h3>Medical Staff</h3>
              <p className="metric-value">{stats.doctors}</p>
            </div>
            <div className="card metric-card">
              <h3>Total Registered</h3>
              <p className="metric-value">{stats.patients}</p>
            </div>
          </div>

          <h2 className="section-title">Registration Queue (Non-Clinical)</h2>
          <div className="card table-card">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Created At</th>
                  <th>Patient ID</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length > 0 ? recentPatients.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-small">{(p.fullName || p.firstName || "P").charAt(0)}</div>
                        <span style={{ fontWeight: 500 }}>{p.fullName || `${p.firstName} ${p.lastName}`}</span>
                      </div>
                    </td>
                    <td><span className="date-text">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span></td>
                    <td><span className="date-text">#{p.id.slice(-6)}</span></td>
                    <td>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>ENCRYPTED</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      {loading ? 'Analyzing system state...' : 'No patient records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
            * Patient detail links are disabled for Admin roles to maintain clinical privacy. Check Audit Logs for access history.
          </p>
        </div>

        <SecurityInsightsPanel />
        
      </div>
    </div>
  );
};

export default AdminDashboard;
