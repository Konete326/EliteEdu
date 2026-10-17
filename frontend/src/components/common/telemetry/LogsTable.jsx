import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatDiagnosticReport } from '../../../utils/logDiagnosticsFormatter';
import LogsTableRow from './LogsTableRow';
import LogsPagination from './LogsPagination';

const LogsTable = ({
  logs, loading, isSuperAdmin, onView, onDelete,
  page, setPage, totalPages, total, limit, setLimit
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, log) => {
    e.stopPropagation();
    const text = formatDiagnosticReport(log);
    navigator.clipboard.writeText(text);
    setCopiedId(log._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-ink-muted">Loading telemetry stream...</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="p-12 text-center bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl">
        <AlertTriangle className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold text-ink dark:text-ink-dark">No logs found</p>
        <p className="text-xs text-ink-muted mt-0.5">Telemetry stream is clean. No errors recorded.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="w-full overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-ink-muted font-semibold">
              <th className="py-3 px-4">Severity / Category</th>
              <th className="py-3 px-4">Status / Method</th>
              <th className="py-3 px-4">Message / Action</th>
              <th className="py-3 px-4">User / School</th>
              <th className="py-3 px-4">Endpoint / URL</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {logs.map((log) => (
              <LogsTableRow
                key={log._id}
                log={log}
                onView={onView}
                onDelete={onDelete}
                onCopy={handleCopy}
                isCopied={copiedId === log._id}
                isSuperAdmin={isSuperAdmin}
              />
            ))}
          </tbody>
        </table>
      </div>

      <LogsPagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
};

export default LogsTable;
