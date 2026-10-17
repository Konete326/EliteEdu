const ParentContactTable = ({
  columns = [],
  rows = [],
  page = 1,
  pageSize = 25,
  onPageChange
}) => {
  const visibleCols = columns.filter((c) => c.visible);
  const total = rows.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIdx = (page - 1) * pageSize;
  const currentRows = rows.slice(startIdx, startIdx + pageSize);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/70 border-b border-line text-ink-muted uppercase font-bold text-[10px] tracking-wider select-none">
            <tr>
              {visibleCols.map((col) => (
                <th key={col.key} className="px-3 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length} className="py-8 text-center text-ink-muted">
                  No parent/contact records found matching filters.
                </td>
              </tr>
            ) : (
              currentRows.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-surface-secondary/40 transition-colors">
                  {visibleCols.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 whitespace-nowrap text-ink">
                      {col.key === 'name' ? (
                        <span className="font-bold text-ink">{row[col.key]}</span>
                      ) : (
                        row[col.key] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-muted px-1 print:hidden">
        <div>
          Showing {total > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2.5 py-1 rounded-lg border border-line bg-surface text-ink hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Previous
          </button>
          <span className="px-2 font-bold text-ink">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2.5 py-1 rounded-lg border border-line bg-surface text-ink hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentContactTable;
