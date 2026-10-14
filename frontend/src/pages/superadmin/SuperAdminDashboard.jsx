import { useState, useEffect } from 'react';
import { Building2, Users, PlusCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageLoader from '../../components/common/PageLoader';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/superadmin');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm pb-4 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-1">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Super Admin Dashboard</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Live overview of educational institutions and user accounts across the platform.</p>
        </div>
        <Link
          to="/superadmin/schools/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register School</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <PageLoader text="Loading dashboard metrics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">Registered Schools</span>
              <div className="p-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-primary dark:text-primary-dark group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-ink dark:text-ink-dark">{stats?.totalSchools ?? 0}</span>
              <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
                {stats?.privateSchools ?? 0} Private • {stats?.governmentSchools ?? 0} Government
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
              <Link to="/superadmin/schools" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
                <span>View schools directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-primary dark:text-primary-dark group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-ink dark:text-ink-dark">{stats?.totalUsers ?? 0}</span>
              <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
                {stats?.totalTeachers ?? 0} Teachers • {stats?.totalAdmins ?? 0} Principals
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
              <Link to="/superadmin/schools" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
                <span>Inspect user distribution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">Institution Onboarding</span>
              <div className="p-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-primary dark:text-primary-dark group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xl font-bold text-ink dark:text-ink-dark">Add New School</span>
              <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">Register a campus and configure principal credentials</p>
            </div>
            <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
              <Link to="/superadmin/schools/new" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
                <span>Start onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SuperAdminDashboard;
