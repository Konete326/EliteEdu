import { Search, Plus, Sparkles } from 'lucide-react';

const GradesHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCampus,
  setSelectedCampus,
  campuses = [],
  onAddClick,
  onAutoLoad,
  isSeeding
}) => {
  return (
    <div className="sticky top-[1px] z-20 mt-[1px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight shrink-0">Grades & Sections</h1>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grades..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs sm:text-sm text-ink dark:text-ink-dark focus:border-primary outline-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end lg:self-auto flex-wrap">
        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs sm:text-sm font-medium text-ink dark:text-ink-dark outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={onAutoLoad}
          disabled={isSeeding}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/10 text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50"
          title="Auto-load standard classes (Class 1 to Class 10)"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{isSeeding ? 'Loading...' : 'Auto-Load Standard'}</span>
        </button>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-sm shadow-primary/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grade</span>
        </button>
      </div>
    </div>
  );
};

export default GradesHeader;
