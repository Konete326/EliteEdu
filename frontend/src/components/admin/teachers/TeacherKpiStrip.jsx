import { Users, CalendarCheck, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

const TeacherKpiStrip = ({
  teachers = [],
  activeFilter = 'all',
  onFilterChange
}) => {
  const total = teachers.length;
  const presentCount = teachers.filter(
    (t) => t.attendance_today?.status === 'P' || t.attendance_today?.status === 'Present'
  ).length;
  const inClassCount = teachers.filter((t) => t.live_activity?.status === 'in_class').length;
  const freeCount = teachers.filter((t) => t.live_activity?.status === 'free').length;
  const assignedCount = teachers.filter(
    (t) => (t.subjects && t.subjects.length > 0) || (t.grades && t.grades.length > 0)
  ).length;

  const cards = [
    {
      id: 'all',
      label: 'Total Faculty',
      value: total,
      sub: `${assignedCount} Assigned to Classes`,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      id: 'present',
      label: 'Present Today',
      value: presentCount,
      sub: `${total ? Math.round((presentCount / total) * 100) : 0}% Attendance Rate`,
      icon: CalendarCheck,
      color: 'text-good dark:text-good-dark',
      bg: 'bg-good/10 dark:bg-good/20 border-good/30'
    },
    {
      id: 'in_class',
      label: 'In Class Right Now',
      value: inClassCount,
      sub: 'Actively Teaching',
      icon: BookOpen,
      color: 'text-accent dark:text-accent-dark',
      bg: 'bg-accent/10 dark:bg-accent/20 border-accent/30',
      liveBadge: true
    },
    {
      id: 'free',
      label: 'Free Periods Now',
      value: freeCount,
      sub: 'Available for Substitution',
      icon: Clock,
      color: 'text-info dark:text-info-dark',
      bg: 'bg-info/10 dark:bg-info/20 border-info/30'
    },
    {
      id: 'assigned',
      label: 'Class Allocated',
      value: assignedCount,
      sub: `${total - assignedCount} Unassigned`,
      icon: CheckCircle2,
      color: 'text-primary dark:text-primary-dark',
      bg: 'bg-primary/15 dark:bg-primary/25 border-primary/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
                : 'border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2 w-full">
              <span className="text-[11px] font-semibold text-ink-muted truncate">
                {c.label}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {c.liveBadge && inClassCount > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                )}
                <div className={`p-1.5 rounded-xl border ${c.bg}`}>
                  <Icon size={14} className={c.color} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-black font-mono text-ink dark:text-white tracking-tight">
                {c.value}
              </p>
              <p className="text-[10px] text-ink-muted font-medium mt-0.5 truncate">
                {c.sub}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TeacherKpiStrip;
