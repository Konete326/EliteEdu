import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';

const StudentAttendanceKpiStrip = ({ summary = {} }) => {
  const cards = [
    { label: 'Total Enrolled', value: summary.total || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Present Today', value: summary.present || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Absent', value: summary.absent || 0, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'On Leave / Late', value: (summary.leave || 0) + (summary.late || 0), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">{c.label}</p>
              <h3 className="text-2xl font-black text-ink dark:text-ink-dark mt-0.5">{c.value}</h3>
            </div>
            <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentAttendanceKpiStrip;
