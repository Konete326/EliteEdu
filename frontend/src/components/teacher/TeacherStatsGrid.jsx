import { GraduationCap, BookOpen, Users, ShieldCheck } from 'lucide-react';

const TeacherStatsGrid = ({ classesCount = 0, subjectsCount = 0, studentsCount = 0, permissionsCount = 0 }) => {
  const cards = [
    { title: 'Assigned Classes', count: classesCount, icon: GraduationCap, color: 'text-primary bg-primary/10 border-primary/20' },
    { title: 'Taught Subjects', count: subjectsCount, icon: BookOpen, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { title: 'My Enrolled Students', count: studentsCount, icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Active Modules', count: permissionsCount, icon: ShieldCheck, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-ink dark:text-ink-dark mt-1">
                {card.count}
              </h3>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherStatsGrid;
