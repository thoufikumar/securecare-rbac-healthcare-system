import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../backend/modules/auth/useAuth";

const NurseLayout = () => {
  const { logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: 'var(--color-primary)' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>N</span>
          </div>
          <span>Nurse Portal</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/nurse" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Dashboard
          </NavLink>
          <NavLink to="/nurse/monitoring" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Patient Monitoring
          </NavLink>
          <NavLink to="/nurse/tasks" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Care Tasks
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar" style={{ background: '#ec4899' }}>N</div>
            <div className="user-info">
              <span className="user-name">Nurse Staff</span>
              <span className="user-email">{user?.email || "nurse@securecare.com"}</span>
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

export default NurseLayout;
