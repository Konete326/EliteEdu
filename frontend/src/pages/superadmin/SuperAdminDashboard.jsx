import { Building2, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Schools', value: '12', change: '+2 this month', icon: Building2, href: '/superadmin/schools' },
  { label: 'Total Users', value: '1,420', change: '+8% vs last month', icon: Users, href: '/superadmin/schools' },
  { label: 'System Health', value: '99.9%', change: 'All services nominal', icon: ShieldCheck, href: null }
];

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Super Admin Dashboard</h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Overview of educational institutions, platform reach, and global system health.</p>
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
                    <span>View details</span>
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

export default SuperAdminDashboard;
