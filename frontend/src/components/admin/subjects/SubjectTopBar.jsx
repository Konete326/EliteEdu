import { Plus, Search, X, Sparkles } from 'lucide-react';
import { DEFAULT_CLASSES } from '../../../utils/curriculumPresets';

const SubjectTopBar = ({
  searchQuery,
  onSearchChange,
  campuses,
  selectedCampus,
  onCampusChange,
  selectedClass,
  onClassChange,
  onAutoLoad,
  onAddClick,
  isSeeding
}) => {
  return (
    <div className="sticky top-0 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">Subjects</h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Curriculum courses and academic subject assignments.
          </p>
        </div>

        <div className="relative flex-1 max-w-sm sm:ml-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none focus:border-primary transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Classes</option>
          {DEFAULT_CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onAutoLoad}
          disabled={isSeeding}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/10 text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50"
          title="Auto-load standard Pakistani curriculum subjects (Class 1 to Class 10)"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{isSeeding ? 'Loading...' : 'Auto-Load Standard'}</span>
        </button>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>
    </div>
  );
};

export default SubjectTopBar;
