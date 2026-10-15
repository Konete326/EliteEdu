import { CalendarCheck } from 'lucide-react';

const AttendanceWidget = ({ stats, attendanceSummary }) => {
  const data = attendanceSummary || stats?.attendanceSummary || stats;
  const campuses = data?.campusBreakdown || [];

  const pills = [
    { key: 'p', label: 'P', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
    { key: 'a', label: 'A', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50' },
    { key: 'l', label: 'L', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' },
    { key: 'late', label: 'Late', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    { key: 'hd', label: 'HD', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' },
    { key: 'hol', label: 'Hol', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50' },
    { key: 'um', label: 'UM', color: 'bg-surface-secondary text-ink-muted border-line dark:border-line-dark' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Attendance</h2>
        </div>
        <span className="text-xs text-ink-muted">{data?.date || 'Today'}</span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/30 border border-line dark:border-line-dark space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink dark:text-ink-dark">Students</span>
            <span className="text-ink-muted text-[11px]">{data?.students?.marked}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {pills.map((p) => (
              <span key={p.key} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${p.color}`}>
                <span>{p.label}:</span>
                <span>{data?.students?.[p.key] ?? 0}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/30 border border-line dark:border-line-dark space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink dark:text-ink-dark">Staff</span>
            <span className="text-ink-muted text-[11px]">{data?.staff?.marked}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {pills.map((p) => (
              <span key={p.key} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${p.color}`}>
                <span>{p.label}:</span>
                <span>{data?.staff?.[p.key] ?? 0}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-ink-muted text-[11px]">
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 font-medium text-center">Total</th>
              <th className="pb-2 font-medium text-center">P</th>
              <th className="pb-2 font-medium text-center">A</th>
              <th className="pb-2 font-medium text-center">L</th>
              <th className="pb-2 font-medium text-center">Late</th>
              <th className="pb-2 font-medium text-center">HD</th>
              <th className="pb-2 font-medium text-center">Hol</th>
              <th className="pb-2 font-medium text-center">UM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 text-[11px]">
            {campuses.map((c, i) => (
              <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                <td className="py-2.5">
                  <p className="font-semibold text-ink dark:text-ink-dark">{c.name}</p>
                  <p className="text-[10px] text-ink-muted">{c.sub}</p>
                </td>
                <td className="py-2.5 text-center font-bold">{c.students?.total}</td>
                <td className="py-2.5 text-center text-emerald-600 font-semibold">{c.students?.p}</td>
                <td className="py-2.5 text-center text-rose-600 font-semibold">{c.students?.a}</td>
                <td className="py-2.5 text-center text-blue-600 font-semibold">{c.students?.l}</td>
                <td className="py-2.5 text-center text-amber-600 font-semibold">{c.students?.late}</td>
                <td className="py-2.5 text-center text-purple-600 font-semibold">{c.students?.hd}</td>
                <td className="py-2.5 text-center text-pink-600 font-semibold">{c.students?.hol}</td>
                <td className="py-2.5 text-center text-ink-muted">{c.students?.um}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceWidget;
