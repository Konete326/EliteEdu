import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role);
    const hasCustomRole = Boolean(user.custom_role_id || user.custom_role);
    const isSuper = user.role === 'SuperAdmin';
    if (!hasRole && !hasCustomRole && !isSuper) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
