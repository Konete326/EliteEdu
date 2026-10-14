import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotFoundFace from '../../components/common/NotFoundFace';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/login';
    if (user.role === 'SuperAdmin') return '/superadmin';
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Teacher') return '/teacher';
    return '/login';
  };

  const homeRoute = getHomeRoute();
  const homeLabel = user ? 'Return to Dashboard' : 'Back to Login';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        <NotFoundFace />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-bad-soft dark:bg-bad/20 text-bad">
            <span>404 Error</span>
            <span>•</span>
            <span>Page Not Found</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-ink-dark tracking-tight">
            Looks like you're lost
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
            The page you are looking for doesn't exist, was renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-dark text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(homeRoute)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{homeLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
