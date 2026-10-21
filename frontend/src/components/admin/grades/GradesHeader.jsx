import { Search, Plus, Sparkles, Layers, X, RotateCw } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const GradesHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCampus,
  setSelectedCampus,
  campuses = [],
  onAddClick,
  onAutoLoad,
  isSeeding,
  onRefresh,
  loading,
  totalCount = 0
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-2xs">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
              Academic Grades & Class Sections
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark">
              {totalCount} {totalCount === 1 ? 'Class' : 'Classes'}
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Configure academic levels, section subdivisions, and teacher allocations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
        <div className="relative">
          <Search size={14} className="text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes or teachers..."
            className="w-48 sm:w-60 pl-9 pr-7 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs text-ink dark:text-white outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {campuses && campuses.length > 1 && (
          <div className="w-40 sm:w-48">
            <SearchableSelect
              options={[
                { value: '', label: 'All Campuses' },
                ...campuses.map((c) => ({ value: c._id, label: c.name }))
              ]}
              value={selectedCampus || ''}
              onChange={setSelectedCampus}
              placeholder="All Campuses"
              size="sm"
            />
          </div>
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh grades data"
          >
            <RotateCw size={14} className={loading ? 'animate-spin text-primary' : ''} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAutoLoad}
          disabled={isSeeding}
          className="px-3.5 py-2 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary/10 text-xs font-bold transition-all shadow-2xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          title="Auto-load standard curriculum grades (Playgroup to Class 10)"
        >
          <Layers size={14} className="text-primary" />
          <span>{isSeeding ? 'Seeding...' : 'Auto-Load'}</span>
        </button>

        <button
          type="button"
          onClick={onAddClick}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Grade</span>
        </button>
      </div>
    </div>
  );
};

export default GradesHeader;
