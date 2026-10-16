const STAFF_STATUS_BADGES = [
  { key: 'present', label: 'Present', code: 'P', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { key: 'absent', label: 'Absent', code: 'A', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' },
  { key: 'leave', label: 'Leave', code: 'L', color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  { key: 'late', label: 'Late', code: 'LT', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  { key: 'halfDay', label: 'Half Day', code: 'HD', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  { key: 'holiday', label: 'Holiday', code: 'Hol', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
  { key: 'unmarked', label: 'Unmarked', code: 'U', color: 'bg-ink-muted/15 text-ink-muted border-line dark:border-line-dark' }
];

const StaffAttendanceStatsCard = ({ summary = {}, total = 0 }) => {
  const presentCount = summary.present || 0;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Staff Turnout</span>
          <div className="text-xl font-black text-ink dark:text-ink-dark">{attendanceRate}% <span className="text-xs font-medium text-ink-muted">Present</span></div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Total Staff</span>
          <div className="text-xl font-black text-ink dark:text-ink-dark">{total}</div>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark overflow-hidden flex">
        <div style={{ width: `${total ? ((summary.present || 0) / total) * 100 : 0}%` }} className="bg-emerald-500 transition-all" />
        <div style={{ width: `${total ? ((summary.late || 0) / total) * 100 : 0}%` }} className="bg-amber-500 transition-all" />
        <div style={{ width: `${total ? ((summary.leave || 0) / total) * 100 : 0}%` }} className="bg-sky-500 transition-all" />
        <div style={{ width: `${total ? ((summary.halfDay || 0) / total) * 100 : 0}%` }} className="bg-purple-500 transition-all" />
        <div style={{ width: `${total ? ((summary.holiday || 0) / total) * 100 : 0}%` }} className="bg-indigo-500 transition-all" />
        <div style={{ width: `${total ? ((summary.absent || 0) / total) * 100 : 0}%` }} className="bg-rose-500 transition-all" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
        {STAFF_STATUS_BADGES.map((b) => (
          <div key={b.key} className={`p-2 rounded-xl border flex flex-col items-center justify-center ${b.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider">{b.code}</span>
            <span className="text-base font-black">{summary[b.key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAttendanceStatsCard;
