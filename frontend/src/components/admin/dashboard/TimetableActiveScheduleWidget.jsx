import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';

const TimetableActiveScheduleWidget = ({ upcomingClasses = [] }) => {
  const classes = upcomingClasses.slice(0, 5);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Current & Upcoming Classes</h3>
            <p className="text-[10px] text-ink-muted">Master timetable schedule</p>
          </div>
        </div>
        <Link
          to="/admin/timetable"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Full Timetable</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="py-6 text-center text-xs text-ink-muted flex flex-col items-center justify-center space-y-1">
          <BookOpen className="w-6 h-6 opacity-30 text-ink-muted" />
          <p className="font-medium">No active periods scheduled</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {classes.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/40 text-xs border border-line/40 dark:border-line-dark/40"
            >
              <div className="min-w-0 pr-2">
                <p className="font-bold text-ink dark:text-white truncate">{c.title}</p>
                <p className="text-[10px] text-ink-muted">{c.time || 'Class Period'}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] shrink-0">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(TimetableActiveScheduleWidget);

