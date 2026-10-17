import { Copy, FileSpreadsheet, FileText, Printer, Search } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { copyTableData, downloadCsv, downloadExcel, triggerPrint } from '../../../utils/reportExportUtils';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';

const ReportExportToolbar = ({
  columns = [],
  rows = [],
  filename = 'institutional-report',
  onToggleColumn,
  pageSize = 25,
  onPageSizeChange,
  searchTerm = '',
  onSearchChange
}) => {
  const toast = useToast();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-surface-secondary/40 border border-line print:hidden">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => copyTableData(columns, rows, toast)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-xs font-semibold text-ink-sub hover:text-ink transition-colors cursor-pointer shadow-2xs"
        >
          <Copy size={13} className="text-primary" />
          <span>Copy</span>
        </button>

        <button
          type="button"
          onClick={() => downloadCsv(columns, rows, filename)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-xs font-semibold text-ink-sub hover:text-ink transition-colors cursor-pointer shadow-2xs"
        >
          <FileText size={13} className="text-emerald-600" />
          <span>CSV</span>
        </button>

        <button
          type="button"
          onClick={() => downloadExcel(columns, rows, filename)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-xs font-semibold text-ink-sub hover:text-ink transition-colors cursor-pointer shadow-2xs"
        >
          <FileSpreadsheet size={13} className="text-teal-600" />
          <span>Excel</span>
        </button>

        <button
          type="button"
          onClick={triggerPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-xs font-semibold text-ink-sub hover:text-ink transition-colors cursor-pointer shadow-2xs"
        >
          <Printer size={13} className="text-indigo-600" />
          <span>PDF / Print</span>
        </button>

        {columns.length > 0 && onToggleColumn && (
          <ColumnVisibilityMenu columns={columns} onToggleColumn={onToggleColumn} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-line bg-surface text-ink font-semibold outline-none focus:border-primary text-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
        )}

        {onSearchChange && (
          <div className="relative flex items-center">
            <span className="text-xs font-semibold text-ink-muted mr-1.5">Search:</span>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter table..."
                className="pl-7 pr-3 py-1 text-xs rounded-lg border border-line bg-surface text-ink placeholder:text-ink-muted outline-none focus:border-primary w-36 sm:w-44"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportExportToolbar;
