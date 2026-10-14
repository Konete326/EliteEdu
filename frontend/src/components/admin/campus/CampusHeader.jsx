import { Plus, Search, X } from 'lucide-react';

const CampusHeader = ({ searchQuery, onSearchChange, onAddClick, totalCount, filteredCount }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Campus Management</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">
            Manage your business branches and campuses.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-sm hover:shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search campuses by name, email, website, address..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 text-ink dark:text-ink-dark placeholder:text-ink-muted dark:placeholder:text-ink-muted-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-ink-dark p-0.5 rounded"
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
