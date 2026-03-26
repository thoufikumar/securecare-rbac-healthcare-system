// src/frontend/modules/receptionist/ReceptionDashboard.jsx
// Dashboard view for receptionists – manage appointments and patient check-ins.

import useAuth from "../../../backend/modules/auth/useAuth";

const ReceptionDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Reception Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <nav>
        <ul>
          <li><a href="/reception/appointment">📅 Manage Appointments</a></li>
          <li><a href="/reception/checkin">✅ Patient Check-In</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default ReceptionDashboard;
