import { Eye, Trash2, Copy, Check } from 'lucide-react';

const SEVERITY_COLORS = {
  CRITICAL: 'bg-bad/15 text-bad border-bad/30',
  ERROR: 'bg-bad/10 text-bad border-bad/20',
  WARNING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  INFO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
};

const LogsTableRow = ({ log, onView, onDelete, onCopy, isCopied, isSuperAdmin }) => {
  const sevBadge = SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.INFO;

  return (
    <tr
      onClick={() => onView(log)}
      className="hover:bg-surface-secondary/40 dark:hover:bg-surface-secondary-dark/40 transition-colors cursor-pointer group"
    >
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${sevBadge}`}>
            {log.severity || 'INFO'}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">{log.category}</span>
        </div>
      </td>
      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
        <span className="font-bold text-ink dark:text-ink-dark">{log.method || 'GET'}</span>
        {log.status_code && (
          <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${log.status_code >= 400 ? 'bg-bad/15 text-bad' : 'bg-emerald-500/15 text-emerald-600'}`}>
            {log.status_code}
          </span>
        )}
      </td>
      <td className="py-3 px-4 max-w-sm font-medium text-ink dark:text-ink-dark truncate" title={log.message}>
        <div>{log.message}</div>
        {log.last_clicked_element && (
          <div className="text-[10px] text-ink-muted truncate font-normal">Action: {log.last_clicked_element}</div>
        )}
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="font-semibold text-ink dark:text-ink-dark">{log.user_name || 'Anonymous'}</div>
        <div className="text-[10px] text-ink-muted">{log.school_name || 'Global'}</div>
      </td>
      <td className="py-3 px-4 max-w-[200px] truncate text-ink-muted font-mono text-[11px]" title={log.endpoint || log.page_url}>
        {log.endpoint || log.page_url || '—'}
      </td>
      <td className="py-3 px-4 whitespace-nowrap text-ink-muted text-[11px]">
        {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
      </td>
      <td className="py-3 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => onCopy(e, log)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isCopied
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent hover:border-line hover:bg-surface-secondary text-ink-muted hover:text-ink'
            }`}
            title={isCopied ? 'Copied to clipboard' : 'Copy diagnostic error'}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onView(log); }}
            className="p-1.5 rounded-lg border border-transparent hover:border-line hover:bg-surface-secondary text-ink-muted hover:text-primary transition-all cursor-pointer"
            title="View full log details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(log); }}
              className="p-1.5 rounded-lg border border-transparent hover:border-bad/20 hover:bg-bad/10 text-ink-muted hover:text-bad transition-all cursor-pointer"
              title="Delete log entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LogsTableRow;
