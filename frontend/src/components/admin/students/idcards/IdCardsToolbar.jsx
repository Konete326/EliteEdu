import { ArrowLeft, Printer, SlidersHorizontal, Search, GraduationCap, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IdCardsStyleSwitcher from './IdCardsStyleSwitcher';

const IdCardsToolbar = ({
  selectedStyle, onSelectStyle, searchQuery, onSearchChange,
  campuses = [], selectedCampus, onCampusChange, grades = [],
  selectedGrade, onGradeChange, selectedCount, totalCount,
  onToggleSelectAll, onOpenCustomize, onExportPdf, isExporting
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 print:hidden">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="font-bold text-ink dark:text-ink-dark">Students</span>
          <span>&gt;</span>
          <span className="text-primary font-bold">ID Cards Studio</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#121217] text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="sticky top-[1px] z-20 mt-[1px] flex flex-wrap items-center justify-between gap-3 bg-surface/95 dark:bg-[#0c0c0f]/95 backdrop-blur-md border border-line dark:border-line-dark rounded-2xl p-3 shadow-sm">
        <IdCardsStyleSwitcher selectedStyle={selectedStyle} onSelectStyle={onSelectStyle} />

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student or GR..."
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

          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="px-2 py-1.5 rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-xs font-medium text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="">All Classes</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
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
            onClick={onOpenCustomize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#121217] text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#16161d] hover:bg-surface-secondary text-ink dark:text-ink-dark text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>{isExporting ? 'Generating PDF...' : 'Vector PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print (8/Page)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdCardsToolbar;
