import { CheckCircle2, User } from 'lucide-react';

const PromotionStudentCard = ({ student, isSelected, onToggle, onScoreChange, passThreshold }) => {
  const isPass = student.calculated_exam_percentage >= passThreshold;

  return (
    <div
      onClick={onToggle}
      className={`relative p-2.5 rounded-xl border transition-all cursor-pointer select-none space-y-2 ${
        isSelected
          ? 'bg-primary/5 dark:bg-primary/10 border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark shadow-md'
          : 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark hover:border-primary/50 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 aspect-square rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex items-center justify-center font-bold text-xs text-ink dark:text-ink-dark overflow-hidden shrink-0">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-ink-muted" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-ink dark:text-ink-dark truncate">{student.name}</h4>
            <p className="text-[10px] text-ink-muted truncate">S/O {student.father_name || 'N/A'}</p>
          </div>
        </div>

        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isSelected ? 'bg-primary text-white shadow-xs' : 'border border-line dark:border-line-dark text-transparent'
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 text-[11px] pt-1 border-t border-line/60 dark:border-line-dark/60">
        <span className="font-mono text-[10px] text-ink-muted">GR #{student.gr_number}</span>
        <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-surface-secondary dark:bg-surface-secondary-dark text-ink-sub">
          {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-[10px] text-ink-muted">Score:</span>
          <input
            type="number"
            value={student.calculated_exam_percentage}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onScoreChange(student._id, e.target.value)}
            className="w-12 px-1.5 py-0.5 rounded-md border border-line dark:border-line-dark bg-surface-secondary/40 text-[11px] font-bold text-ink dark:text-ink-dark text-center outline-none focus:border-primary"
          />
          <span className="text-[10px] text-ink-muted">%</span>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          isPass ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-bad/10 text-bad border-bad/20'
        }`}>
          {isPass ? 'PASS' : 'FAIL'}
        </span>
      </div>

      {student.last_promotion_label && (
        <div className="text-[10px] font-bold text-primary dark:text-primary-dark bg-primary/10 px-2 py-0.5 rounded-md text-center truncate">
          Promoted: {student.last_promotion_label}
        </div>
      )}
    </div>
  );
};

export default PromotionStudentCard;
