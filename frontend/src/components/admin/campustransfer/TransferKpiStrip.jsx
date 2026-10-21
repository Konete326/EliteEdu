import { ArrowLeftRight, GraduationCap, Users, Calendar } from 'lucide-react';

const TransferKpiStrip = ({ kpis = {} }) => {
  const cards = [
    {
      label: 'Total Transfers',
      value: kpis.totalTransfers || 0,
      sub: 'All-time relocation events',
      icon: ArrowLeftRight,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      label: 'Student Transfers',
      value: kpis.studentTransfers || 0,
      sub: 'Relocated pupils',
      icon: GraduationCap,
      color: 'text-good dark:text-good-dark',
      bg: 'bg-good/10 dark:bg-good/20 border-good/30'
    },
    {
      label: 'Staff Reassignments',
      value: kpis.staffTransfers || 0,
      sub: 'Faculty reallocated',
      icon: Users,
      color: 'text-info dark:text-info-dark',
      bg: 'bg-info/10 dark:bg-info/20 border-info/30'
    },
    {
      label: 'Transfers This Month',
      value: kpis.thisMonthTransfers || 0,
      sub: 'Current cycle activity',
      icon: Calendar,
      color: 'text-accent dark:text-accent-dark',
      bg: 'bg-accent/10 dark:bg-accent/20 border-accent/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-ink-muted truncate">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-xl border ${c.bg} shrink-0`}>
                <Icon size={14} className={c.color} />
              </div>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-black font-mono text-ink dark:text-white tracking-tight">
                {c.value}
              </p>
              <p className="text-[10px] text-ink-muted mt-0.5 truncate">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransferKpiStrip;
