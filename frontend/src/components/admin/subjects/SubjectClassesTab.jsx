import { DEFAULT_CLASSES } from '../../../utils/curriculumPresets';

const SubjectClassesTab = ({
  formData,
  setFormData,
  grades = []
}) => {
  const gradeNames = grades.map((g) => g.name || g).filter(Boolean);
  const combined = gradeNames.length > 0 ? gradeNames : DEFAULT_CLASSES;
  const availableClasses = Array.from(new Set([...combined, ...(formData.classes || [])]));

  const primary = availableClasses.filter((c) => /class\s*[1-5]\b|grade\s*[1-5]\b/i.test(c));
  const middle = availableClasses.filter((c) => /class\s*[6-8]\b|grade\s*[6-8]\b/i.test(c));
  const matric = availableClasses.filter((c) => /class\s*(9|10)\b|grade\s*(9|10)\b|matric/i.test(c));

  const quickTiers = [
    { label: 'All Classes', classes: availableClasses },
    ...(primary.length > 0 ? [{ label: 'Primary (1-5)', classes: primary }] : []),
    ...(middle.length > 0 ? [{ label: 'Middle (6-8)', classes: middle }] : []),
    ...(matric.length > 0 ? [{ label: 'Matric (9-10)', classes: matric }] : [])
  ];

  const selectedClasses = formData.classes || [];

  const toggleClass = (className) => {
    if (selectedClasses.includes(className)) {
      setFormData((prev) => ({ ...prev, classes: prev.classes.filter((c) => c !== className) }));
    } else {
      setFormData((prev) => ({ ...prev, classes: [...selectedClasses, className] }));
    }
  };

  const applyTier = (tierClasses) => {
    const allIncluded = tierClasses.length > 0 && tierClasses.every((c) => selectedClasses.includes(c));
    if (allIncluded) {
      setFormData((prev) => ({ ...prev, classes: prev.classes.filter((c) => !tierClasses.includes(c)) }));
    } else {
      setFormData((prev) => ({ ...prev, classes: Array.from(new Set([...selectedClasses, ...tierClasses])) }));
    }
  };

  const totalMarks = (Number(formData.theory_marks) || 0) + (Number(formData.practical_marks) || 0);

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-semibold text-ink dark:text-white">
            Target Classes ({selectedClasses.length} selected)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, classes: [] }))}
              className="text-[11px] text-ink-muted hover:text-bad cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {quickTiers.map((tier) => {
            const isActive = tier.classes.length > 0 && tier.classes.every((c) => selectedClasses.includes(c));
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => applyTier(tier.classes)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface dark:bg-[#1f1f1f] border border-line dark:border-line-dark text-ink-muted hover:text-ink'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 pt-1 max-h-44 overflow-y-auto">
          {availableClasses.map((cls) => {
            const isSelected = selectedClasses.includes(cls);
            return (
              <button
                key={cls}
                type="button"
                onClick={() => toggleClass(cls)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center truncate transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary/15 text-primary border border-primary dark:bg-primary/25 font-bold shadow-2xs'
                    : 'bg-surface dark:bg-[#1a1a1a] border border-line dark:border-line-dark text-ink-muted hover:border-primary/40'
                }`}
              >
                {cls}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
            Weekly Periods
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={formData.periods_per_week || 5}
            onChange={(e) => setFormData((prev) => ({ ...prev, periods_per_week: Number(e.target.value) }))}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
            Theory Marks
          </label>
          <input
            type="number"
            min={0}
            max={200}
            value={formData.theory_marks ?? 75}
            onChange={(e) => setFormData((prev) => ({ ...prev, theory_marks: Number(e.target.value) }))}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
            Practical Marks
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={formData.practical_marks ?? 0}
            onChange={(e) => setFormData((prev) => ({ ...prev, practical_marks: Number(e.target.value) }))}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line dark:border-line-dark text-xs">
        <span className="font-semibold text-ink-muted">Total Subject Marks:</span>
        <span className="font-bold font-mono text-sm text-primary dark:text-primary-dark">
          {totalMarks} Marks {formData.practical_marks > 0 ? `(${formData.theory_marks} Th + ${formData.practical_marks} Pr)` : ''}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-ink dark:text-white">Active Status</span>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }))}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
            formData.status === 'Active' ? 'bg-primary' : 'bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              formData.status === 'Active' ? 'translate-x-5' : 'translate-x-0 bg-ink-muted'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default SubjectClassesTab;
