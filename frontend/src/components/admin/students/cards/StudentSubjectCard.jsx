import { Check } from 'lucide-react';

const StudentSubjectCard = ({ sub, isSelected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(sub._id)}
      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
        isSelected
          ? 'border-primary bg-primary-soft/40 dark:bg-primary/10 shadow-sm'
          : 'border-line dark:border-white/10 bg-surface-secondary/30 dark:bg-[#141414]/50 hover:bg-surface-secondary'
      }`}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-ink dark:text-ink-dark">{sub.name}</span>
          <span className="font-mono text-[10px] text-ink-muted">({sub.code})</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className={`font-semibold ${sub.mandatory ? 'text-primary' : 'text-ink-muted'}`}>
            {sub.mandatory ? 'Mandatory' : 'Elective'}
          </span>
        </div>
      </div>

      <div
        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
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
