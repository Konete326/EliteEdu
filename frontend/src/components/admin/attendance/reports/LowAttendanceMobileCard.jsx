import React from 'react';
import { AlertTriangle, User } from 'lucide-react';

const LowAttendanceMobileCard = ({ row, targetType }) => {
  const name = targetType === 'Student' ? row.student?.name : row.staff?.name;
  const subInfo =
    targetType === 'Student'
      ? `GR: ${row.student?.gr_number || '—'} • Class: ${row.student?.current_section || 'A'}`
      : `${row.staff?.designation || 'Faculty'} • Code: ${row.staff?.employee_code || '—'}`;

  return (
    <div className="p-3 rounded-2xl border border-rose-500/20 bg-surface dark:bg-surface-dark shadow-2xs space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <User size={14} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-ink dark:text-white truncate">
              {name || 'Defaulter Profile'}
            </h4>
            <p className="text-[10px] text-ink-muted truncate font-mono">
              {subInfo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 shrink-0">
          <AlertTriangle size={11} />
          <span className="text-[10px] font-mono font-bold">{row.percentage}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
        <div className="p-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
          <span className="block text-[8px] font-bold text-emerald-700 dark:text-emerald-300">PRESENT</span>
          <span className="font-bold">{row.presentCount || 0}</span>
        </div>
        <div className="p-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
          <span className="block text-[8px] font-bold text-rose-700 dark:text-rose-300">ABSENT</span>
          <span className="font-bold">{row.absentCount || 0}</span>
        </div>
        <div className="p-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
          <span className="block text-[8px] font-bold text-amber-700 dark:text-amber-300">LEAVE</span>
          <span className="font-bold">{row.leaveCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LowAttendanceMobileCard;
