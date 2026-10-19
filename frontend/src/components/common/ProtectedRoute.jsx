import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], requiredModule = null }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || '').trim().toLowerCase();

  if (userRole === 'superadmin') {
    return <Outlet />;
  }

  const isSuperAdminOnly = allowedRoles.length > 0 &&
    allowedRoles.every((r) => r.toLowerCase() === 'superadmin');

  if (isSuperAdminOnly) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (userRole === 'admin') {
    return <Outlet />;
  }

  const hasRole = allowedRoles.length === 0 ||
    allowedRoles.some((r) => r.toLowerCase() === userRole);

  if (requiredModule) {
    const modKey = requiredModule.toLowerCase();
    const effective = user.effective_permissions || {};
    const modPerm = effective[modKey] || (user.permissions || []).find((p) => p.module_key?.toLowerCase() === modKey);
    const hasModAccess = Boolean(modPerm?.view);

    if (hasRole && hasModAccess) return <Outlet />;
    if (!hasRole && hasModAccess) return <Outlet />;
    return <Navigate to="/unauthorized" replace />;
  }

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
