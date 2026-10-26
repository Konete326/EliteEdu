import { Printer, Download, CheckSquare, Square, Search, Archive } from 'lucide-react';

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
  onPrintSheet,
  onExportPdf,
  isExporting = false,
  onExportZip,
  isExportingZip = false
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
        <div className="inline-flex items-center rounded-xl border border-line overflow-hidden">
          <button
            type="button"
            onClick={() => onPrintSheet ? onPrintSheet('current') : window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-secondary text-xs font-semibold cursor-pointer"
            title="Print active sheet via browser print dialog"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>Print Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => onPrintSheet ? onPrintSheet('all') : window.print()}
            className="px-2 py-1.5 border-l border-line hover:bg-surface-secondary text-ink-muted hover:text-ink text-[11px] font-bold cursor-pointer"
            title="Print all selected faculty sheets"
          >
            All
          </button>
        </div>
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
        {onExportZip && (
          <button
            onClick={onExportZip}
            disabled={isExportingZip || selectedCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-600/30 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            title="Export Vendor ZIP"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{isExportingZip ? 'Packing...' : 'Export ZIP'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UniversalIdCardToolbarActions;
