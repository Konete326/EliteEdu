import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Video, ArrowUpRight } from 'lucide-react';
import CalendarWidget from './CalendarWidget';
import StudentStatisticsWidget from './StudentStatisticsWidget';
import CrmPipelineWidget from './CrmPipelineWidget';

const DashboardRightColumn = ({ birthdaysToday, upcomingClasses, studentStats, crmPipeline }) => {
  const birthdays = birthdaysToday || [];
  const classes = upcomingClasses || [];

  return (
    <div className="space-y-6">
      <CalendarWidget />

      <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <Link to="/admin/events" className="flex items-center justify-between mb-4 group cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-ink dark:text-ink-dark group-hover:text-primary transition-colors">Birthdays Today</h3>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-ink-muted" />
              </div>
              <p className="text-[10px] text-ink-muted">Celebrations - Classroom</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-secondary text-ink dark:text-ink-dark">
            {birthdays.length}
          </span>
        </Link>

        {birthdays.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-ink-muted">
            <Gift className="w-8 h-8 stroke-[1.5] mb-2 opacity-40" />
            <p className="text-xs font-medium">No birthdays today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {birthdays.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary text-xs">
                <span className="font-semibold text-ink dark:text-ink-dark">{b.name}</span>
                <span className="text-[11px] text-pink-600 font-bold">{b.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <Link to="/admin/online-classes" className="flex items-center justify-between mb-4 group cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark group-hover:text-primary transition-colors">Virtual Classrooms</h3>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-ink-muted" />
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            Coming Soon
          </span>
        </Link>

        {classes.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-ink-muted">
            <Video className="w-8 h-8 stroke-[1.5] mb-2 opacity-40" />
            <p className="text-xs font-medium">Virtual Classroom Studio coming soon</p>
          </div>
        ) : (
          <div className="space-y-2">
            {classes.map((c, i) => (
              <div key={i} className="p-2 rounded-xl bg-surface-secondary text-xs">
                <p className="font-semibold text-ink dark:text-ink-dark">{c.title}</p>
                <p className="text-[10px] text-ink-muted">{c.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <StudentStatisticsWidget studentStats={studentStats} />

      <CrmPipelineWidget crmPipeline={crmPipeline} />
    </div>
  );
};

export default memo(DashboardRightColumn);
