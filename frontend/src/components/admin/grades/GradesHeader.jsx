import { Search, Plus, Sparkles, Layers, X } from 'lucide-react';

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
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Grades & Sections</h1>
            <p className="text-xs font-semibold text-ink-muted">Configure academic classes, section allocations and student limits</p>
          </div>
        </div>

        <div className="relative flex-1 max-w-2xl w-full mt-2 sm:mt-0 sm:ml-2">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grades..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs sm:text-sm text-ink dark:text-ink-dark focus:border-primary outline-none shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end lg:self-auto flex-wrap shrink-0">
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/10 text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          title="Auto-load standard classes (Class 1 to Class 10)"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{isSeeding ? 'Loading...' : 'Auto-Load Standard'}</span>
        </button>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-sm shadow-primary/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grade</span>
        </button>
      </div>
    </div>
  );
};

export default GradesHeader;
