import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../backend/config/firebase";

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
    <div className="crm-view">
      <h1 className="view-title">Dashboard</h1>

      <div className="dashboard-metrics-grid">
        <div className="card metric-card">
          <h3>Total Users</h3>
          <p className="metric-value">{stats.users}</p>
        </div>
        <div className="card metric-card">
          <h3>Staff Doctors</h3>
          <p className="metric-value">{stats.doctors}</p>
        </div>
        <div className="card metric-card">
          <h3>Total Patients</h3>
          <p className="metric-value">{stats.patients}</p>
        </div>
        <div className="card metric-card">
          <h3>System Status</h3>
          <p className="metric-value" style={{ color: '#10b981' }}>Healthy</p>
        </div>
      </div>

      <h2 className="section-title">Recent Patients</h2>
      <div className="card table-card">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Patient ID</th>
              <th>Actions</th>
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
                <td>
                  <span className={`role-badge role-receptionist`}>
                    Registered
                  </span>
                </td>
                <td><span className="date-text">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span></td>
                <td><span className="date-text">#{p.id.slice(-6)}</span></td>
                <td>
                  <Link to={`/doctor/patient/${p.id}`} className="btn-icon">View</Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  {loading ? 'Fetching records...' : 'No patients registered yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
