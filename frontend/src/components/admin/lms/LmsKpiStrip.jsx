import { BookOpen, FileText, Video, Radio, Award } from 'lucide-react';

const LmsKpiStrip = ({ kpis = {}, onSelectTab }) => {
  const cards = [
    {
      id: 'syllabus',
      label: 'Syllabus Progress',
      value: `${kpis.syllabusCompletionPct || 0}%`,
      sub: 'Curriculum Covered',
      icon: Award,
      color: 'text-primary dark:text-primary-dark bg-primary/10 border-primary/20'
    },
    {
      id: 'homework',
      label: 'Active Homework',
      value: kpis.activeHomework || 0,
      sub: 'Assigned Tasks',
      icon: FileText,
      color: 'text-accent dark:text-accent-dark bg-accent/10 border-accent/20'
    },
    {
      id: 'material',
      label: 'Lectures & Material',
      value: kpis.studyMaterials || 0,
      sub: 'Study Resources',
      icon: Video,
      color: 'text-good dark:text-good-dark bg-good/10 border-good/20'
    },
    {
      id: 'quizzes',
      label: 'Online Quizzes',
      value: kpis.onlineQuizzes || 0,
      sub: 'Assessments',
      icon: BookOpen,
      color: 'text-info dark:text-info-dark bg-info/10 border-info/20'
    },
    {
      id: 'live',
      label: 'Live Classrooms',
      value: kpis.liveClasses || 0,
      sub: 'Virtual Sessions',
      icon: Radio,
      color: 'text-bad dark:text-bad-dark bg-bad/10 border-bad/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onSelectTab && onSelectTab(c.id)}
            className={`p-3 sm:p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 ${
              onSelectTab ? 'cursor-pointer hover:border-primary/40' : ''
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${c.color}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-ink-muted truncate block">
                {c.label}
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-ink dark:text-white tracking-tight">
                {c.value}
              </p>
              <p className="text-[10px] text-ink-muted truncate hidden sm:block">
                {c.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LmsKpiStrip;
