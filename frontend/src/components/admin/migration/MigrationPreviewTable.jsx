import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const MigrationPreviewTable = ({ previewData, onCommit, committing, onCellChange }) => {
  if (!previewData || !previewData.rows) return null;
  const { totalRows, validCount, errorCount, rows } = previewData;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500">Total: {totalRows}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valid: {validCount}
          </span>
          {errorCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-900/30 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Errors: {errorCount}
            </span>
          )}
        </div>
        <button
          onClick={onCommit}
          disabled={committing || validCount === 0}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          {committing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
          Stage 2: Execute Batch Import ({validCount} Records)
        </button>
      </div>

      <div className="overflow-x-auto max-h-96 border rounded-xl border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-2.5 w-12 text-center">#</th>
              <th className="p-2.5 w-20">Status</th>
              <th className="p-2.5 w-64">Validation Notes</th>
              <th className="p-2.5">Row Data Attributes (Editable)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((r, rowIdx) => (
              <tr key={r.rowIndex} className={r.isValid ? 'hover:bg-gray-50/50' : 'bg-rose-50/20 hover:bg-rose-50/30'}>
                <td className="p-2.5 font-mono text-center font-bold text-gray-400">{r.rowIndex}</td>
                <td className="p-2.5">
                  {r.isValid ? (
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-700">VALID</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-700">ERROR</span>
                  )}
                </td>
                <td className="p-2.5">
                  {r.errors?.length > 0 ? (
                    <div className="space-y-0.5">
                      {r.errors.map((err, ei) => (
                        <p key={ei} className="text-[11px] text-rose-600 dark:text-rose-400 font-medium leading-tight">• {err}</p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Ready for commit</span>
                  )}
                </td>
                <td className="p-2.5">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(r.data || {}).map(([key, val]) => {
                      if (key === 'grade_id') return null;
                      return (
                        <div key={key} className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase">{key}:</span>
                          <input
                            type="text"
                            value={val || ''}
                            onChange={(e) => onCellChange(rowIdx, key, e.target.value)}
                            className="text-xs bg-transparent text-gray-800 dark:text-gray-200 outline-none w-28 font-mono"
                          />
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MigrationPreviewTable;
