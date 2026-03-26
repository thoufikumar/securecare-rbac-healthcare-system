// src/frontend/modules/auth/Unauthorized.jsx

const Unauthorized = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <h1>403 – Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <a href="/login" className="back-link">← Back to Login</a>
      </div>
    </div>
  );
};

export default Unauthorized;
