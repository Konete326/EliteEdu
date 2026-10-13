import { Users, GraduationCap, CalendarCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Teachers', value: '48', change: 'Across all departments', icon: Users, href: '/admin/teachers' },
  { label: 'Total Students', value: '820', change: 'Active enrolled', icon: GraduationCap, href: null },
  { label: "Today's Attendance", value: '94.2%', change: 'Present today', icon: CalendarCheck, href: null }
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Principal & Admin Dashboard</h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Institutional control center for faculty, students, and attendance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="p-5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">{s.label}</span>
                <div className="p-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-primary dark:text-primary-dark group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-ink dark:text-ink-dark">{s.value}</span>
                <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">{s.change}</p>
              </div>
              {s.href && (
                <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
                  <Link to={s.href} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
                    <span>Manage faculty</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
