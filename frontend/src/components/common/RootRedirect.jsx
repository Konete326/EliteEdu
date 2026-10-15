import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'SuperAdmin') {
    return <Navigate to="/superadmin" replace />;
  }

  if (user?.role === 'Teacher') {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/admin" replace />;
};

export default RootRedirect;
