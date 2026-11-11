import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardKpiRow from '../../components/admin/dashboard/DashboardKpiRow';
import AppStatsWidget from '../../components/admin/dashboard/AppStatsWidget';
import AdmissionsChartWidget from '../../components/admin/dashboard/AdmissionsChartWidget';
import AttendanceHomeworkWidget from '../../components/admin/dashboard/AttendanceHomeworkWidget';
import DashboardRightColumn from '../../components/admin/dashboard/DashboardRightColumn';
import DashboardSkeleton from '../../components/admin/dashboard/DashboardSkeleton';
import Testimonial2 from '../../components/ui/testimonial-section-2';

const EMPTY_ARRAY = [];
let memoryDashboardStats = null;

const getInitialDashboardStats = () => {
  if (memoryDashboardStats) return memoryDashboardStats;
  try {
    const cached = sessionStorage.getItem('elite_admin_dashboard_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      memoryDashboardStats = parsed;
      return parsed;
    }
  } catch {}
  return null;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(getInitialDashboardStats);
  const [loading, setLoading] = useState(() => !stats);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        if (isMounted) {
          setStats(res.data);
          memoryDashboardStats = res.data;
          try {
            sessionStorage.setItem('elite_admin_dashboard_cache', JSON.stringify(res.data));
          } catch {}
        }
      } catch (err) {
        if (isMounted && !stats) {
          setError(err.response?.data?.message || 'Failed to load dashboard metrics');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const isPrivate = (user?.school_type || stats?.school?.school_type) === 'Private';
  const spotlightStudents = stats?.spotlightStudents || EMPTY_ARRAY;
  const spotlightTeachers = stats?.spotlightTeachers || EMPTY_ARRAY;

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12">
      {error && (
        <div className="p-4 rounded-2xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <DashboardKpiRow topKpis={stats?.topKpis} />

      <Testimonial2
        students={spotlightStudents}
        teachers={spotlightTeachers}
        title="Academic Community Spotlight"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <AppStatsWidget appStats={stats?.appDownloadStats} stats={stats} />
          <AdmissionsChartWidget admissionsStats={stats?.admissionsStats} stats={stats} />
          <AttendanceHomeworkWidget
            attendanceSummary={stats?.attendanceSummary}
            homeworkSummary={stats?.homeworkSummary}
            stats={stats}
          />
        </div>

        <div className="xl:col-span-4">
          <DashboardRightColumn
            birthdaysToday={stats?.birthdaysToday}
            upcomingClasses={stats?.upcomingClasses}
            studentStats={stats?.studentStats}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
