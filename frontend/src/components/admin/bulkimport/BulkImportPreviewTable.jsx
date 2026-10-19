import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Trash2, Rocket, RefreshCw } from 'lucide-react';
import BulkImportTableHeader from './BulkImportTableHeader';

const BulkImportPreviewTable = ({
  rows = [],
  onUpdateRowCell,
  onRemoveRow,
  onExecuteImport,
  executing,
  summary = { total: 0, validCount: 0, errorCount: 0 }
}) => {
  const [filter, setFilter] = useState('all');

  const filteredRows = rows.filter((r) => {
    if (filter === 'valid') return r.isValid;
    if (filter === 'invalid') return !r.isValid;
    return true;
  });

  const columns = rows.length > 0 ? Object.keys(rows[0].data || {}).filter((k) => k !== 'grade_id' && k !== 'subject_id') : [];

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line rounded-2xl p-5 shadow-sm space-y-4">
      <BulkImportTableHeader summary={summary} filter={filter} setFilter={setFilter} />

      <div className="overflow-x-auto max-h-96 rounded-xl border border-line">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/70 sticky top-0 z-10 text-[10px] uppercase font-bold text-ink-muted border-b border-line">
            <tr>
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Status</th>
              {columns.map((col) => (
                <th key={col} className="py-2 px-3 whitespace-nowrap">{col.replace(/_/g, ' ')}</th>
              ))}
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 3} className="py-8 text-center text-ink-muted text-xs">
                  No records to display. Upload a file or paste Excel data to inspect.
                </td>
              </tr>
            ) : (
              filteredRows.map((r, rowIdx) => (
                <tr key={r.rowIndex || rowIdx} className={r.isValid ? 'hover:bg-emerald-500/5' : 'bg-rose-500/5'}>
                  <td className="py-2 px-3 font-mono text-[10px] text-ink-muted">{r.rowIndex}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.isValid ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20" title={r.errors?.join(', ')}>
                        <AlertTriangle className="w-3 h-3" /> {r.errors?.[0] || 'Error'}
                      </span>
                    )}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="py-1 px-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={r.data[col] ?? ''}
                        onChange={(e) => onUpdateRowCell(r.rowIndex, col, e.target.value)}
                        className="px-1.5 py-0.5 rounded border border-transparent hover:border-line focus:border-primary bg-transparent text-xs font-medium outline-none w-32"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right">
                    <button type="button" onClick={() => onRemoveRow(r.rowIndex)} className="p-1 rounded text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-ink-muted">Click any cell to edit typos directly before importing.</p>
        <button
          type="button"
          disabled={executing || summary.validCount === 0}
          onClick={onExecuteImport}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
        >
          {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
          <span>Execute Bulk Import ({summary.validCount} Valid Rows)</span>
        </button>
      </div>
    </div>
  );
};

export default BulkImportPreviewTable;
