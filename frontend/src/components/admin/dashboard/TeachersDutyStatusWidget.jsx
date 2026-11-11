import { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowUpRight, Clock } from 'lucide-react';

const TeachersDutyStatusWidget = ({ staffAttendance, totalTeachers = 0 }) => {
  const present = (staffAttendance?.p || 0) + (staffAttendance?.late || 0);
  const onLeave = staffAttendance?.l || 0;
  const absent = staffAttendance?.a || 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Faculty On-Duty Status</h3>
            <p className="text-[10px] text-ink-muted">Today staff attendance tracking</p>
          </div>
        </div>
        <Link
          to="/admin/attendance/staff"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Staff Log</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          <span className="block text-[10px] uppercase font-bold text-ink-muted">Present</span>
          <span className="text-base font-black">{present}</span>
        </div>
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
          <span className="block text-[10px] uppercase font-bold text-ink-muted">On Leave</span>
          <span className="text-base font-black">{onLeave}</span>
        </div>
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
          <span className="block text-[10px] uppercase font-bold text-ink-muted">Absent</span>
          <span className="text-base font-black">{absent}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(TeachersDutyStatusWidget);

