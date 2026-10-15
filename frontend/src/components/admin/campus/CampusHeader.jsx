import { Plus, Search, X } from 'lucide-react';

const CampusHeader = ({ searchQuery, onSearchChange, onAddClick, totalCount, filteredCount }) => {
  return (
    <div className="sticky top-0 z-20 space-y-4 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">Campus Management</h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Manage your institutional branches and physical campuses.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-line/60 dark:border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search campuses by name, email, website, address..."
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

        <div className="text-xs text-ink-muted dark:text-ink-muted-dark self-center sm:self-auto font-medium">
          Showing {filteredCount} of {totalCount} {totalCount === 1 ? 'campus' : 'campuses'}
        </div>
      </div>
    </div>
  );
};

export default CampusHeader;
