import { Building2, CheckCircle2, GraduationCap, Users, Compass } from 'lucide-react';

const CampusKpiStrip = ({ kpis = {}, activeCampusName = 'All Campuses' }) => {
  const cards = [
    {
      label: 'Total Campuses',
      value: kpis.total || 0,
      sub: `${kpis.active || 0} Active • ${kpis.inactive || 0} Inactive`,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      label: 'Active Branches',
      value: kpis.active || 0,
      sub: `${kpis.total ? Math.round(((kpis.active || 0) / kpis.total) * 100) : 0}% Operational`,
      icon: CheckCircle2,
      color: 'text-good dark:text-good-dark',
      bg: 'bg-good/10 dark:bg-good/20 border-good/30'
    },
    {
      label: 'Enrolled Students',
      value: kpis.totalStudents || 0,
      sub: 'Across all branches',
      icon: GraduationCap,
      color: 'text-info dark:text-info-dark',
      bg: 'bg-info/10 dark:bg-info/20 border-info/30'
    },
    {
      label: 'Faculty & Staff',
      value: kpis.totalTeachers || 0,
      sub: 'Assigned personnel',
      icon: Users,
      color: 'text-primary dark:text-primary-dark',
      bg: 'bg-primary/15 dark:bg-primary/25 border-primary/30'
    },
    {
      label: 'Active Workspace',
      value: activeCampusName || 'All Campuses',
      sub: 'Currently scoped',
      icon: Compass,
      color: 'text-accent dark:text-accent-dark',
      bg: 'bg-accent/10 dark:bg-accent/20 border-accent/30',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
              i === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
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
              <p
                className={`font-black text-ink dark:text-white tracking-tight ${
                  c.isText ? 'text-xs sm:text-sm truncate' : 'text-xl sm:text-2xl font-mono'
                }`}
                title={c.isText ? String(c.value) : undefined}
              >
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

export default CampusKpiStrip;
