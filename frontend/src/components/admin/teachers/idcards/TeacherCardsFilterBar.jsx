import { Printer, Search } from 'lucide-react';

const TeacherCardsFilterBar = ({
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  selectedCount,
  totalCount,
  onToggleSelectAll
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-44">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search staff, CNIC..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <select
        value={selectedCampus}
        onChange={(e) => onCampusChange(e.target.value)}
        className="px-2 py-1.5 rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-xs font-medium text-ink dark:text-ink-dark outline-none cursor-pointer"
      >
        <option value="">All Campuses</option>
        {campuses.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={onToggleSelectAll}
        className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-[11px] font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary"
      >
        {selectedCount === totalCount && totalCount > 0 ? 'Deselect All' : `Selected (${selectedCount}/${totalCount})`}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Cards (8/Page)</span>
      </button>
    </div>
  );
};

export default TeacherCardsFilterBar;
