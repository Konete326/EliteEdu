import { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserX, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const TodayAbsentStudentsWidget = ({ absentStudents = [] }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <UserX className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Today Absent Students</h2>
            <p className="text-[11px] text-ink-muted">Recorded unexcused absentees</p>
          </div>
        </div>
        <Link
          to="/admin/attendance/students"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {absentStudents.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted flex flex-col items-center justify-center space-y-1.5">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="font-semibold text-ink dark:text-white">All Students Present</p>
          <p className="text-ink-muted text-[11px]">No absentees reported on-record today</p>
        </div>
      ) : (
        <div className="divide-y divide-line dark:divide-line-dark border border-line dark:border-line-dark rounded-xl overflow-hidden">
          {absentStudents.map((st, i) => (
            <div
              key={st.id || i}
              className="flex items-center justify-between p-2.5 bg-surface-secondary/30 text-xs hover:bg-surface-secondary/60 transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="font-bold text-ink dark:text-white truncate">{st.name}</p>
                <p className="text-[10px] text-ink-muted">
                  GR: <span className="font-semibold text-ink dark:text-ink-dark">{st.gr}</span> • Sec {st.section}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 font-bold text-[10px] shrink-0">
                Absent
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(TodayAbsentStudentsWidget);

