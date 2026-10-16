import { Eye, Trash2, Clock, Globe, AlertTriangle } from 'lucide-react';

const SEVERITY_COLORS = {
  CRITICAL: 'bg-bad/15 text-bad border-bad/30',
  ERROR: 'bg-bad/10 text-bad border-bad/20',
  WARNING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  INFO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
};

const LogsTable = ({ logs, loading, isSuperAdmin, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="p-8 text-center bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-ink-muted">Loading telemetry logs...</p>
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
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-ink-muted font-semibold">
            <th className="py-3 px-4">Severity / Category</th>
            <th className="py-3 px-4">Message / Action</th>
            <th className="py-3 px-4">User / School</th>
            <th className="py-3 px-4">Endpoint / URL</th>
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {logs.map((log) => {
            const sevBadge = SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.INFO;
            return (
              <tr key={log._id} className="hover:bg-surface-secondary/30 dark:hover:bg-surface-secondary-dark/30 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${sevBadge}`}>
                      {log.severity || 'INFO'}
                    </span>
                    <span className="text-[11px] font-medium text-ink-muted">{log.category}</span>
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs truncate font-medium text-ink dark:text-ink-dark" title={log.message}>
                  {log.message || log.last_clicked_element || '—'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-ink dark:text-ink-dark">{log.user_name || 'Anonymous'}</div>
                  <div className="text-[10px] text-ink-muted">{log.school_name || 'Global'}</div>
                </td>
                <td className="py-3 px-4 max-w-[180px] truncate text-ink-muted font-mono text-[11px]" title={log.endpoint || log.page_url}>
                  {log.endpoint || log.page_url || '—'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-ink-muted text-[11px]">
                  {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(log)}
                      className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors cursor-pointer"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => onDelete(log._id)}
                        className="p-1.5 rounded-lg hover:bg-bad/10 text-ink-muted hover:text-bad transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
