import { ArrowLeft, Printer, Search, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STYLES = [
  { id: 'GovtSindh', label: 'Govt of Sindh' },
  { id: 'Institutional', label: 'Institutional' },
  { id: 'ModernMinimal', label: 'Modern Minimal' }
];

const SIDES = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'both', label: 'Both' }
];

const TeacherIdCardsToolbar = ({
  selectedStyle,
  onSelectStyle,
  sideMode,
  onSideModeChange,
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  selectedCount,
  totalCount,
  onToggleSelectAll
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 print:hidden">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Award className="w-4 h-4 text-primary" />
          <span className="font-bold text-ink dark:text-ink-dark">Staff Directory</span>
          <span>&gt;</span>
          <span className="text-primary font-bold">Service Cards Studio</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/teachers')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#121217] text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-secondary/50 dark:bg-[#16161d] p-1 rounded-xl border border-line dark:border-line-dark">
            {STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStyle(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedStyle === st.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink dark:text-ink-dark hover:bg-surface-secondary'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-surface-secondary/50 dark:bg-[#16161d] p-1 rounded-xl border border-line dark:border-line-dark">
            {SIDES.map((sd) => (
              <button
                key={sd.id}
                type="button"
                onClick={() => onSideModeChange(sd.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  sideMode === sd.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-ink dark:text-ink-dark hover:bg-surface-secondary'
                }`}
              >
                {sd.label}
              </button>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default TeacherIdCardsToolbar;
