import { Check } from 'lucide-react';
import { formatClassesLabel } from '../../../../utils/curriculumPresets';

const StudentSubjectCard = ({ sub, isSelected, onToggle }) => {
  const classesLabel = formatClassesLabel(sub.classes);

  return (
    <div
      onClick={() => onToggle(sub._id)}
      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
        isSelected
          ? 'border-primary bg-primary-soft/40 dark:bg-primary/10 shadow-sm'
          : 'border-line dark:border-white/10 bg-surface-secondary/30 dark:bg-[#141414]/50 hover:bg-surface-secondary dark:hover:bg-white/[0.08]'
      }`}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-ink dark:text-ink-dark">{sub.name}</span>
          <span className="font-mono text-[10px] text-ink-muted">({sub.code})</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
          <span className={`font-semibold ${sub.mandatory ? 'text-primary' : 'text-ink-muted'}`}>
            {sub.mandatory ? 'Mandatory' : 'Elective'}
          </span>
          {classesLabel && (
            <span className="text-[10px] text-ink-muted bg-surface dark:bg-[#1c1c1c] px-1.5 py-0.2 rounded border border-line dark:border-white/10">
              {classesLabel}
            </span>
          )}
        </div>
      </div>

      <div
        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ml-2 ${
          isSelected
            ? 'bg-primary border-primary text-white'
            : 'border-line dark:border-white/20 bg-surface dark:bg-[#0c0c0c]'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </div>
  );
};

export default StudentSubjectCard;
