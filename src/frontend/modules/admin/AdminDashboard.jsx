import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="crm-view">
      <h1 className="view-title">Dashboard</h1>

      <div className="dashboard-metrics-grid">
        <div className="card metric-card">
          <h3>Total Users</h3>
          <p className="metric-value">24</p>
        </div>
        <div className="card metric-card">
          <h3>Active Sessions</h3>
          <p className="metric-value">12</p>
        </div>
        <div className="card metric-card">
          <h3>Security Alerts</h3>
          <p className="metric-value" style={{ color: '#ef4444' }}>2</p>
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
              <th>Assigned Doctor</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, name: "Andrew Peterson", status: "In Process", doctor: "Dr. Marcus Chen", date: "Today 10:30AM", color: "role-receptionist" },
              { id: 2, name: "Brooklyn Simmons", status: "Discharged", doctor: "Dr. Sarah Jenkins", date: "Yesterday 04:15PM", color: "role-doctor" },
              { id: 3, name: "Leslie Alexander", status: "In Process", doctor: "Dr. Emily Wong", date: "Yesterday 11:20AM", color: "role-receptionist" },
              { id: 4, name: "Jacob Jones", status: "Admitted", doctor: "Dr. Marcus Chen", date: "Oct 24, 2023", color: "role-nurse" },
              { id: 5, name: "Dianne Russell", status: "In Process", doctor: "Dr. Sarah Jenkins", date: "Oct 24, 2023", color: "role-receptionist" },
              { id: 6, name: "Marvin McKinney", status: "Discharged", doctor: "Dr. Emily Wong", date: "Oct 23, 2023", color: "role-doctor" },
              { id: 7, name: "Kathryn Murphy", status: "Admitted", doctor: "Dr. Marcus Chen", date: "Oct 23, 2023", color: "role-nurse" },
              { id: 8, name: "Arlene McCoy", status: "In Process", doctor: "Dr. Sarah Jenkins", date: "Oct 22, 2023", color: "role-receptionist" },
              { id: 9, name: "Eleanor Pena", status: "Discharged", doctor: "Dr. Emily Wong", date: "Oct 21, 2023", color: "role-doctor" },
              { id: 10, name: "Darlene Robertson", status: "Admitted", doctor: "Dr. Marcus Chen", date: "Oct 20, 2023", color: "role-nurse" },
            ].map(p => (
              <tr key={p.id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar-small">{p.name.charAt(0)}</div>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${p.color}`}>
                    {p.status}
                  </span>
                </td>
                <td><span className="date-text">{p.doctor}</span></td>
                <td><span className="date-text">{p.date}</span></td>
                <td>
                  <button className="btn-icon">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
