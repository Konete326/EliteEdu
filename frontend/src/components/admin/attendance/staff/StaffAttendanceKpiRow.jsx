import React from 'react';
import MobileScrollSlider from '../../../common/MobileScrollSlider';

const StaffAttendanceKpiRow = ({ summary = {} }) => {
  const items = [
    { label: 'PRESENT', count: summary.present || 0, textClass: 'text-emerald-600 dark:text-emerald-400', cardClass: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'ABSENT', count: summary.absent || 0, textClass: 'text-rose-600 dark:text-rose-400', cardClass: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'LEAVE', count: summary.leave || 0, textClass: 'text-sky-600 dark:text-sky-400', cardClass: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'SHORT LEAVE', count: summary.shortLeave || 0, textClass: 'text-cyan-600 dark:text-cyan-400', cardClass: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'LATE', count: summary.late || 0, textClass: 'text-amber-600 dark:text-amber-400', cardClass: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'HOLIDAYS', count: summary.holiday || 0, textClass: 'text-rose-600 dark:text-rose-400', cardClass: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'UNMARKED', count: summary.unmarked || 0, textClass: 'text-slate-600 dark:text-slate-400', cardClass: 'bg-slate-500/10 border-slate-500/20' }
  ];

  return (
    <MobileScrollSlider>
      <div className="flex gap-2 pb-1 sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border ${item.cardClass} flex flex-col justify-between shrink-0 min-w-[105px] sm:min-w-0 transition-all`}
          >
            <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider ${item.textClass}`}>
              {item.label}
            </span>
            <span className={`text-lg sm:text-2xl font-black mt-0.5 sm:mt-1 ${item.textClass}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </MobileScrollSlider>
  );
};

export default StaffAttendanceKpiRow;
