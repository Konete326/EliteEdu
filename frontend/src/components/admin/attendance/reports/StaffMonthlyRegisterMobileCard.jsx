import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, UserCheck } from 'lucide-react';

const StaffMonthlyRegisterMobileCard = ({ row, days = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const staff = row.staff || {};
  const rate = row.percentage ?? 0;

  const rateBadgeClass =
    rate >= 80
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : rate >= 60
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

  return (
    <div className="p-3 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <UserCheck size={13} className="text-primary shrink-0" />
            <h4 className="font-bold text-xs text-ink dark:text-white truncate">
              {staff.name || 'Staff Member'}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-ink-muted font-mono mt-0.5">
            <span>{staff.designation || 'Faculty'}</span>
            <span>• Code: {staff.employee_code || '—'}</span>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${rateBadgeClass} shrink-0`}>
          {rate}%
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
        <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="block text-[9px] font-bold text-emerald-700 dark:text-emerald-300">P</span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{row.presentCount || 0}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <span className="block text-[9px] font-bold text-rose-700 dark:text-rose-300">A</span>
          <span className="text-xs font-black text-rose-600 dark:text-rose-400">{row.absentCount || 0}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="block text-[9px] font-bold text-amber-700 dark:text-amber-300">L</span>
          <span className="text-xs font-black text-amber-600 dark:text-amber-400">{row.leaveCount || 0}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
          <span className="block text-[9px] font-bold text-ink-muted">DAYS</span>
          <span className="text-xs font-black text-ink dark:text-ink-dark">{days.length}</span>
        </div>
      </div>

      <div className="pt-1 border-t border-line/60 dark:border-line-dark/60">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-[11px] font-bold text-primary hover:text-primary-hover py-1 cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{expanded ? 'Hide 31-Day Register' : 'View 31-Day Register'}</span>
          </span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="pt-2">
            <div className="overflow-x-auto pb-1.5 -mx-1 px-1">
              <div className="flex gap-1 min-w-max">
                {days.map((d) => {
                  const entry = row.dayMap?.[d.dayStr];
                  const st = entry?.status;
                  const bg =
                    st === 'P'
                      ? 'bg-emerald-500 text-white'
                      : st === 'A'
                      ? 'bg-rose-500 text-white font-bold'
                      : st === 'L'
                      ? 'bg-amber-500 text-white font-bold'
                      : st === 'LT'
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark';

                  return (
                    <div key={d.day} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono font-semibold text-ink-muted">{d.day}</span>
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono shadow-2xs ${bg}`}
                        title={entry?.in ? `In: ${entry.in}` : ''}
                      >
                        {st || '·'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffMonthlyRegisterMobileCard;
