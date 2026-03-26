import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../backend/modules/auth/useAuth";

const DoctorLayout = () => {
  const { logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const rolePath = user?.role === "nurse" ? "/nurse" : "/doctor";
  const portalName = user?.role === "nurse" ? "Nurse Portal" : "Doctor Portal";

  return (
    <div className="app-container">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0D6EFD" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#0D6EFD" />
          </svg>
          <span>{portalName}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to={rolePath} end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Dashboard
          </NavLink>
          <NavLink to={`${rolePath}/patients`} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Patients
          </NavLink>
          <NavLink to={`${rolePath}/records`} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Records
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar" style={{ background: user?.role === 'nurse' ? '#ec4899' : '#2563eb' }}>
              {user?.role === 'nurse' ? 'N' : 'D'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.role === 'nurse' ? 'Nurse' : 'Doctor'}</span>
              <span className="user-email">{user?.email || "staff@system.com"}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTENT ── */}
      <main className="main-content">
        <div className="dashboard-view-layer" style={{ padding: 0 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;
