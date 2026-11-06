import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultDashboardRoute } from '../../utils/navigation';

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDefaultDashboardRoute(user?.role)} replace />;
};

export default RootRedirect;
