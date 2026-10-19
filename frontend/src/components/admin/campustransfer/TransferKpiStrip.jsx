import { ArrowLeftRight, GraduationCap, Users, Calendar } from 'lucide-react';

const TransferKpiStrip = ({ kpis = {} }) => {
  const cards = [
    { label: 'Total Branch Transfers', value: kpis.totalTransfers || 0, icon: ArrowLeftRight, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Student Transfers', value: kpis.studentTransfers || 0, icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Staff Reallocations', value: kpis.staffTransfers || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Transfers This Month', value: kpis.thisMonthTransfers || 0, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="bg-surface dark:bg-surface-dark border border-line rounded-2xl p-4 shadow-sm flex items-center justify-between">
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

export default TransferKpiStrip;
