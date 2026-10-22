import { GraduationCap, CheckCircle2, UserX, Sparkles } from 'lucide-react';

const StudentKpiStrip = ({
  kpis = { total: 0, active: 0, left: 0, withDiscount: 0 },
  activeFilter = 'all',
  onFilterChange
}) => {
  const total = kpis.total || 0;
  const activeCount = kpis.active || 0;
  const leftCount = kpis.left || 0;
  const discountCount = kpis.withDiscount || 0;

  const cards = [
    {
      id: 'all',
      label: 'Total Students',
      value: total,
      sub: 'Enrolled Directory',
      icon: GraduationCap,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      id: 'Active',
      label: 'Active Students',
      value: activeCount,
      sub: `${total ? Math.round((activeCount / total) * 100) : 0}% Active Enrollment`,
      icon: CheckCircle2,
      color: 'text-good dark:text-good-dark',
      bg: 'bg-good/10 dark:bg-good/20 border-good/30'
    },
    {
      id: 'Left',
      label: 'Left / Inactive',
      value: leftCount,
      sub: 'Withdrawn / Transferred',
      icon: UserX,
      color: 'text-bad dark:text-bad-dark',
      bg: 'bg-bad/10 dark:bg-bad/20 border-bad/30'
    },
    {
      id: 'concession',
      label: 'Fee Concessions',
      value: discountCount,
      sub: 'Special Scholarships',
      icon: Sparkles,
      color: 'text-accent dark:text-accent-dark',
      bg: 'bg-accent/10 dark:bg-accent/20 border-accent/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onFilterChange && onFilterChange(c.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'border-primary ring-2 ring-primary/20 bg-surface dark:bg-[#141414] shadow-xs'
                : 'border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] shadow-2xs hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2 w-full">
              <span className="text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark truncate">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-xl border ${c.bg}`}>
                <Icon size={14} className={c.color} />
              </div>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-black font-mono text-ink dark:text-white tracking-tight">
                {c.value.toLocaleString()}
              </p>
              <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium mt-0.5 truncate">
                {c.sub}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StudentKpiStrip;
