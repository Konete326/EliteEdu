import { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, School } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageLoader from '../../components/common/PageLoader';
import SuperAdminKpiCards from '../../components/superadmin/SuperAdminKpiCards';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/superadmin');
        if (isMounted) setStats(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="sticky top-[1px] z-10 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm pb-4 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-[1px]">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Super Admin Dashboard</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Live multi-tenant institutional overview and ecosystem controls.</p>
        </div>
        <Link to="/superadmin/schools/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm w-fit">
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
        <PageLoader text="Loading live ecosystem metrics..." />
      ) : (
        <div className="space-y-6">
          <SuperAdminKpiCards stats={stats} />

          {stats?.recentSchools?.length > 0 && (
            <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
              <h2 className="text-sm font-bold text-ink dark:text-ink-dark mb-3">Recently Registered Institutions</h2>
              <div className="divide-y divide-line dark:divide-line-dark">
                {stats.recentSchools.map((school) => (
                  <div key={school._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <School className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="font-semibold text-ink dark:text-ink-dark">{school.name}</span>
                        <span className="ml-2 text-ink-muted">{school.school_type}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${school.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-bad-soft text-bad'}`}>
                      {school.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
