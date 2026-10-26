import { Users, Award, TrendingUp, AlertTriangle } from 'lucide-react';

const BehaviorKpiStrip = ({ kpis = {} }) => {
  const cards = [
    {
      label: 'Students Evaluated',
      value: kpis.totalStudents || 0,
      icon: Users,
      color: 'text-primary'
    },
    {
      label: 'Exemplary Conduct',
      value: kpis.exemplaryCount || 0,
      icon: Award,
      color: 'text-good dark:text-good-dark'
    },
    {
      label: 'Class Average',
      value: `${kpis.classAverage || '5.0'} / 5`,
      icon: TrendingUp,
      color: 'text-info dark:text-info-dark'
    },
    {
      label: 'Needs Attention',
      value: kpis.needsAttention || 0,
      icon: AlertTriangle,
      color: 'text-warn dark:text-warn-dark'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider truncate">{c.label}</p>
              <h3 className="text-base sm:text-lg font-black text-ink dark:text-ink-dark mt-0.5 leading-tight truncate">{c.value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line/60 dark:border-line-dark/60 shrink-0 ${c.color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BehaviorKpiStrip;
