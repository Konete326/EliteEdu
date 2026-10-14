import { Search, Plus, Play } from 'lucide-react';

const GradesHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCampus,
  setSelectedCampus,
  campuses = [],
  onAddClick
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-xl">
        <h1 className="text-xl font-black text-ink dark:text-ink-dark shrink-0">Grades & Sections</h1>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grades..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-ink-dark focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end lg:self-auto">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface-secondary bg-surface dark:bg-surface-dark shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current text-primary" />
          <span className="hidden sm:inline">Watch Video</span>
        </button>

        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grade</span>
        </button>
      </div>
    </div>
  );
};

export default GradesHeader;
