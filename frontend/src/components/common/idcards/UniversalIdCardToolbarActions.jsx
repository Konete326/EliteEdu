import { Printer, Download, CheckSquare, Square, Search } from 'lucide-react';

const UniversalIdCardToolbarActions = ({
  searchQuery = '',
  onSearchChange,
  campuses = [],
  selectedCampus = '',
  onCampusChange,
  grades = [],
  selectedGrade = '',
  onGradeChange,
  selectedCount = 0,
  totalCount = 0,
  onToggleSelectAll,
  onExportPdf,
  isExporting = false,
}) => {
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by name, code or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-surface-secondary border border-line focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {campuses.length > 0 && (
          <select
            value={selectedCampus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-surface-secondary border border-line focus:outline-none"
          >
            <option value="">All Campuses</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
        {grades.length > 0 && (
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-surface-secondary border border-line focus:outline-none"
          >
            <option value="">All Grades</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSelectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line hover:bg-surface-secondary text-xs font-medium text-ink-muted"
        >
          {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5" />}
          <span>{selectedCount}/{totalCount} Selected</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line hover:bg-surface-secondary text-xs font-semibold"
        >
          <Printer className="w-3.5 h-3.5 text-ink-muted" />
          <span>Print Sheet</span>
        </button>
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            disabled={isExporting || selectedCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UniversalIdCardToolbarActions;
