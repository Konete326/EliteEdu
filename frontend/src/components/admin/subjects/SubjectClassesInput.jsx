import { DEFAULT_CLASSES, CURRICULUM_TIERS } from '../../../utils/curriculumPresets';

const QUICK_TIERS = [
  { label: 'All 1-10', classes: DEFAULT_CLASSES },
  { label: 'Class 1-2', classes: ['Class 1', 'Class 2'] },
  { label: 'Class 3-5', classes: ['Class 3', 'Class 4', 'Class 5'] },
  { label: 'Class 6-8', classes: ['Class 6', 'Class 7', 'Class 8'] },
  { label: 'Class 9', classes: ['Class 9'] },
  { label: 'Class 10', classes: ['Class 10'] },
  { label: 'Matric (9-10)', classes: ['Class 9', 'Class 10'] }
];

const SubjectClassesInput = ({ selectedClasses = [], onChange }) => {
  const toggleClass = (className) => {
    if (selectedClasses.includes(className)) {
      onChange(selectedClasses.filter((c) => c !== className));
    } else {
      onChange([...selectedClasses, className]);
    }
  };

  const applyTier = (tierClasses) => {
    const allIncluded = tierClasses.every((c) => selectedClasses.includes(c));
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
          Target Classes ({selectedClasses.length} selected)
        </label>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-[11px] text-ink-muted hover:text-bad transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-1 pb-1">
        {QUICK_TIERS.map((tier) => {
          const isActive = tier.classes.every((c) => selectedClasses.includes(c));
          return (
            <button
              key={tier.label}
              type="button"
              onClick={() => applyTier(tier.classes)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
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

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
        {DEFAULT_CLASSES.map((cls) => {
          const isSelected = selectedClasses.includes(cls);
          return (
            <button
              key={cls}
              type="button"
              onClick={() => toggleClass(cls)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
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
