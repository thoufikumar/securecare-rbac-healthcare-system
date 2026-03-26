// src/frontend/modules/auth/ProtectedRoute.jsx
// Guards routes by checking auth state and role authorization.
// Consumes global AuthContext via useAuth() — verifies nested user object dynamically.

import { Navigate } from "react-router-dom";
import useAuth from "../../../backend/modules/auth/useAuth";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // Show generic loading spinner while restoring session
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Authenticated but wrong role → unauthorized page
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
