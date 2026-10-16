import { Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const AttendanceSummaryBar = ({ stats = {} }) => {
  const total = stats.Total || 0;
  const present = stats.Present || 0;
  const absent = stats.Absent || 0;
  const late = stats.Late || 0;
  const excused = stats.Excused || 0;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const items = [
    { label: 'Total Enrolled', count: total, icon: Users, color: 'text-text dark:text-text-dark bg-surface-alt dark:bg-white/5' },
    { label: 'Present', count: present, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
    { label: 'Absent', count: absent, icon: XCircle, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
    { label: 'Late', count: late, icon: Clock, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
    { label: 'Excused', count: excused, icon: AlertCircle, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.label} className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${it.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark truncate">{it.label}</p>
              <p className="text-base font-bold text-text dark:text-text-dark">{it.count}</p>
            </div>
          </div>
        );
      })}
      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Attendance Rate</p>
          <p className="text-base font-bold text-primary">{rate}%</p>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {rate}%
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryBar;
