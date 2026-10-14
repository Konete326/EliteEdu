import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/common/PageLoader';
import DashboardKpiRow from '../../components/admin/dashboard/DashboardKpiRow';
import AppStatsWidget from '../../components/admin/dashboard/AppStatsWidget';
import AdmissionsChartWidget from '../../components/admin/dashboard/AdmissionsChartWidget';
import FinancialOverviewWidget from '../../components/admin/dashboard/FinancialOverviewWidget';
import AttendanceHomeworkWidget from '../../components/admin/dashboard/AttendanceHomeworkWidget';
import DashboardRightColumn from '../../components/admin/dashboard/DashboardRightColumn';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/admin');
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

  if (loading) return <PageLoader text="Loading institutional dashboard..." />;

  const isPrivate = (user?.school_type || stats?.school?.school_type) === 'Private';

  return (
    <div className="space-y-6 pb-12">
      {error && (
        <div className="p-4 rounded-2xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <DashboardKpiRow topKpis={stats?.topKpis} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <AppStatsWidget appStats={stats?.appDownloadStats} />
          <AdmissionsChartWidget admissionsStats={stats?.admissionsStats} />
          {isPrivate && <FinancialOverviewWidget financialOverview={stats?.financialOverview} />}
          <AttendanceHomeworkWidget
            attendanceSummary={stats?.attendanceSummary}
            homeworkSummary={stats?.homeworkSummary}
          />
        </div>

        <div className="xl:col-span-4">
          <DashboardRightColumn
            birthdaysToday={stats?.birthdaysToday}
            upcomingClasses={stats?.upcomingClasses}
            studentStats={stats?.studentStats}
            crmPipeline={stats?.crmPipeline}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
