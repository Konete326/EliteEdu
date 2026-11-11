import { Copy, Check, Eye, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/sessionTimeFormatter';

const SEVERITY_STYLES = {
  error: 'bg-bad/10 text-bad border-bad/20',
  critical: 'bg-bad/20 text-bad border-bad/30 font-black',
  warn: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
};

const LogsMobileCard = ({ log, onView, onDelete, isSuperAdmin, onCopy, isCopied }) => {
  const sev = log.severity || 'info';
  const badgeClass = SEVERITY_STYLES[sev] || SEVERITY_STYLES.info;

  return (
    <div
      onClick={() => onView && onView(log)}
      className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3 shadow-2xs cursor-pointer hover:bg-surface-secondary/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badgeClass}`}>
            {sev}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-secondary text-ink dark:text-white border border-line dark:border-line-dark">
            {log.category || 'System'}
          </span>
          {log.status_code && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                log.status_code >= 400 ? 'bg-bad/15 text-bad' : 'bg-good/15 text-good'
              }`}
            >
              {log.status_code}
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono text-ink-muted shrink-0">
          {log.createdAt ? formatRelativeTime(log.createdAt) : 'Just now'}
        </span>
      </div>

      <div>
        <p className="font-bold text-xs text-ink dark:text-white line-clamp-2">
          {log.message || log.action || 'System operation'}
        </p>
        {log.endpoint && (
          <p className="font-mono text-[10px] text-ink-muted truncate mt-0.5">
            {log.method || 'GET'} {log.endpoint}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
        <span className="truncate max-w-[200px]">
          Actor: <strong className="text-ink dark:text-white font-medium">{log.user_name || log.user_email || 'System'}</strong>
        </span>
        {log.school_name && (
          <span className="truncate max-w-[150px] font-medium">{log.school_name}</span>
        )}
      </div>

      <div
        className="flex items-center justify-end gap-1.5 pt-2 border-t border-line/60 dark:border-line-dark/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => onCopy && onCopy(e, log)}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Copy Diagnostic JSON"
        >
          {isCopied ? <Check size={15} className="text-good" /> : <Copy size={15} />}
        </button>
        <button
          type="button"
          onClick={() => onView && onView(log)}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye size={15} />
        </button>
        {isSuperAdmin && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(log._id)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
            title="Delete Log"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LogsMobileCard;

