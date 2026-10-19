import { DEFAULT_CLASSES } from '../../../utils/curriculumPresets';

const SubjectClassesInput = ({ selectedClasses = [], grades = [], onChange }) => {
  const gradeNames = grades.map((g) => g.name || g).filter(Boolean);
  const combined = gradeNames.length > 0 ? gradeNames : DEFAULT_CLASSES;
  const availableClasses = Array.from(new Set([...combined, ...selectedClasses]));

  const ece = availableClasses.filter((c) => /nursery|playgroup|kg|prep|montessori|early/i.test(c));
  const primary = availableClasses.filter((c) => /class\s*[1-5]\b|grade\s*[1-5]\b/i.test(c));
  const middle = availableClasses.filter((c) => /class\s*[6-8]\b|grade\s*[6-8]\b/i.test(c));
  const sec = availableClasses.filter((c) => /class\s*(9|10)\b|grade\s*(9|10)\b|matric/i.test(c));

  const quickTiers = [
    { label: 'All Classes', classes: availableClasses },
    ...(ece.length > 0 ? [{ label: 'Pre-Primary', classes: ece }] : []),
    ...(primary.length > 0 ? [{ label: 'Class 1-5', classes: primary }] : []),
    ...(middle.length > 0 ? [{ label: 'Class 6-8', classes: middle }] : []),
    ...(sec.length > 0 ? [{ label: 'Matric (9-10)', classes: sec }] : [])
  ];

  const toggleClass = (className) => {
    if (selectedClasses.includes(className)) {
      onChange(selectedClasses.filter((c) => c !== className));
    } else {
      onChange([...selectedClasses, className]);
    }
  };

  const applyTier = (tierClasses) => {
    const allIncluded = tierClasses.length > 0 && tierClasses.every((c) => selectedClasses.includes(c));
    if (allIncluded) {
      onChange(selectedClasses.filter((c) => !tierClasses.includes(c)));
    } else {
      onChange([...new Set([...selectedClasses, ...tierClasses])]);
    }
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
          Target Classes (Optional - {selectedClasses.length} selected)
        </label>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-[11px] text-ink-muted hover:text-bad transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-1 pb-1">
        {quickTiers.map((tier) => {
          const isActive = tier.classes.length > 0 && tier.classes.every((c) => selectedClasses.includes(c));
          return (
            <button
              key={tier.label}
              type="button"
              onClick={() => applyTier(tier.classes)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface dark:bg-[#1f1f1f] border border-line dark:border-white/10 text-ink-muted hover:text-ink'
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 pt-1 max-h-56 overflow-y-auto">
        {availableClasses.map((cls) => {
          const isSelected = selectedClasses.includes(cls);
          return (
            <button
              key={cls}
              type="button"
              onClick={() => toggleClass(cls)}
              title={cls}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center truncate transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/15 dark:bg-primary/25 border-primary text-primary dark:text-primary-dark font-semibold border shadow-xs'
                  : 'bg-surface dark:bg-[#1a1a1a] border border-line dark:border-white/10 text-ink-sub dark:text-ink-muted-dark hover:border-primary/40'
              }`}
            >
              {cls}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectClassesInput;
