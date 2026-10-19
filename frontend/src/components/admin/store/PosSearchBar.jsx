import { Camera, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Textbooks', 'Notebooks', 'Uniform', 'Stationery', 'ID Card & Lanyard', 'Other'];

const PosSearchBar = ({ search, onSearchChange, onSearchSubmit, activeCategory, onCategoryChange, onOpenScanner, grades = [], selectedGrade, onGradeChange }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearchSubmit(search);
                }
              }}
              placeholder="Scan SKU barcode or search items..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
            />
          </div>
          {grades?.length > 0 && (
            <select
              value={selectedGrade || ''}
              onChange={(e) => onGradeChange && onGradeChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none text-ink-muted focus:border-primary shrink-0"
            >
              <option value="">All Classes</option>
              {grades.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs transition-colors shrink-0"
            title="Scan Barcode via Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan SKU</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-ink text-surface dark:bg-surface-secondary dark:text-ink-dark shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-secondary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PosSearchBar;
