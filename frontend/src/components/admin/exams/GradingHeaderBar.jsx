import { Sliders, RotateCcw, Building2 } from 'lucide-react';

const GradingHeaderBar = ({
  campuses = [],
  selectedCampus = '',
  onCampusChange,
  onResetClick,
  saving = false
}) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark">
            <span className="font-semibold text-primary dark:text-primary-dark">General Settings</span>
            <span>&gt;</span>
            <span className="font-bold text-ink dark:text-ink-dark">Exam Grading</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark leading-tight mt-0.5">
            Exam Grading & Policies
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[190px]">
          <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <select
            value={selectedCampus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl bg-surface-secondary/70 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer transition-colors"
          >
            <option value="">All Campuses (Default Policy)</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onResetClick}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-line-dark hover:border-primary/50 bg-surface dark:bg-[#121217] text-ink-sub dark:text-ink-sub-dark hover:text-primary dark:hover:text-primary-dark text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Standard Scale</span>
        </button>
      </div>
    </div>
  );
};

export default GradingHeaderBar;
