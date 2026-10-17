import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

const MasterReportTable = ({
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

  const getStatusBadge = (status) => {
    const s = status || 'Active';
    const colorMap = {
      Active: 'bg-good/10 text-good border-good/20',
      Registered: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
      Inactive: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      Suspended: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Left: 'bg-bad/10 text-bad border-bad/20'
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorMap[s] || colorMap.Active}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/70 border-b border-line text-ink-muted uppercase font-bold text-[10px] tracking-wider select-none">
            <tr>
              {visibleCols.map((col) => (
                <th key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-2.5 text-right print:hidden">Card</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 1} className="py-8 text-center text-ink-muted">
                  No records match current report filters.
                </td>
              </tr>
            ) : (
              currentRows.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-surface-secondary/40 transition-colors">
                  {visibleCols.map((col) => (
                    <td key={col.key} className="px-3 py-2 whitespace-nowrap text-ink">
                      {col.key === 'status' ? (
                        getStatusBadge(r.status)
                      ) : col.key === 'name' ? (
                        <span className="font-bold text-ink">{r[col.key]}</span>
                      ) : col.key === 'gr_number' ? (
                        <span className="font-mono font-bold text-primary">{r[col.key]}</span>
                      ) : (
                        r[col.key] || '—'
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right whitespace-nowrap print:hidden">
                    <Link
                      to={`/admin/reports/report-cards?studentId=${r.id}`}
                      className="p-1 rounded-lg text-primary hover:bg-primary/10 inline-flex items-center"
                      title="Open Report Card"
                    >
                      <Award size={14} />
                    </Link>
                  </td>
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
            className="px-2.5 py-1 rounded-lg border border-line bg-surface text-ink hover:bg-surface-secondary disabled:opacity-40 font-medium"
          >
            Prev
          </button>
          <span className="px-2 font-bold text-ink">{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2.5 py-1 rounded-lg border border-line bg-surface text-ink hover:bg-surface-secondary disabled:opacity-40 font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterReportTable;
