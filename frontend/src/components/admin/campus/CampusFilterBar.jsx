import { Search, X, SlidersHorizontal } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'all', label: 'All Branches' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' }
];

const CampusFilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount
}) => {
  return (
    <div className="p-3 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search branch by name, address, phone, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs text-ink dark:text-white outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl border border-line dark:border-line-dark shrink-0">
          <SlidersHorizontal size={12} className="text-ink-muted ml-1.5 mr-0.5 shrink-0 hidden sm:block" />
          {STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onStatusFilterChange(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-ink-muted font-mono self-end sm:self-center shrink-0">
        Showing <span className="font-bold text-ink dark:text-white">{filteredCount}</span> of {totalCount} {totalCount === 1 ? 'branch' : 'branches'}
      </div>
    </div>
  );
};

export default CampusFilterBar;
