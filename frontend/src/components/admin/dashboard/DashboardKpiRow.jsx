import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, CalendarDays, Video, ArrowUpRight } from 'lucide-react';

const DashboardKpiRow = ({ topKpis }) => {
  const cards = [
    {
      title: 'Active Students',
      value: topKpis?.activeStudents ?? 0,
      sub: `${topKpis?.totalStudents ?? 0} Total`,
      icon: GraduationCap,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/80 border-blue-200/70 dark:bg-blue-950/20 dark:border-blue-900/60',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      path: '/admin/students'
    },
    {
      title: 'Teachers',
      value: topKpis?.teachers ?? 0,
      sub: 'Faculty & Staff',
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/80 border-emerald-200/70 dark:bg-emerald-950/20 dark:border-emerald-900/60',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      path: '/admin/teachers'
    },
    {
      title: 'Subjects',
      value: topKpis?.subjects ?? 0,
      sub: 'Curriculum',
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/80 border-purple-200/70 dark:bg-purple-950/20 dark:border-purple-900/60',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      path: '/admin/subjects'
    },
    {
      title: 'Total Sessions',
      value: topKpis?.totalSessions ?? 0,
      sub: `${topKpis?.upcomingSessions ?? 0} upcoming`,
      icon: CalendarDays,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50/80 border-amber-200/70 dark:bg-amber-950/20 dark:border-amber-900/60',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      path: '/admin/online-classes'
    },
    {
      title: 'Live Now',
      value: topKpis?.liveNow ?? 0,
      sub: 'Online Sessions',
      icon: Video,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50/80 border-rose-200/70 dark:bg-rose-950/20 dark:border-rose-900/60',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      path: '/admin/online-classes'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.title}
            to={c.path}
            className={`p-4 rounded-2xl border shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer block group ${c.bg}`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${c.iconBg} ${c.color} transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-80 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-ink-muted dark:text-ink-muted-dark" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
                {c.value}
              </span>
              <p className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mt-0.5">
                {c.title}
              </p>
              {c.sub && (
                <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  {c.sub}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardKpiRow;
