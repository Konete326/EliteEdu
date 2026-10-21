import React from 'react';
import { Users } from 'lucide-react';

const ClassWiseSummaryMobileCard = ({ row }) => {
  const rate = row.attendance_rate ?? 0;
  const rateColor =
    rate >= 80 ? 'bg-emerald-500' : rate >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="p-3 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <Users size={14} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-ink dark:text-white">
              {row.grade_name} ({row.section})
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">
              Enrolled: {row.total_students}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-ink dark:text-white">
            {rate}%
          </span>
          <div className="w-16 h-1.5 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark mt-1 overflow-hidden">
            <div className={`h-full rounded-full ${rateColor}`} style={{ width: `${rate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="block text-[8px] font-bold">P</span>
          <span className="font-bold">{row.present}</span>
        </div>
        <div className="p-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <span className="block text-[8px] font-bold">A</span>
          <span className="font-bold">{row.absent}</span>
        </div>
        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <span className="block text-[8px] font-bold">L</span>
          <span className="font-bold">{row.leave}</span>
        </div>
        <div className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <span className="block text-[8px] font-bold">LT</span>
          <span className="font-bold">{row.late}</span>
        </div>
        <div className="p-1 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted">
          <span className="block text-[8px] font-bold">UN</span>
          <span className="font-bold">{row.unmarked}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassWiseSummaryMobileCard;
