
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <Navigate
        to={role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
