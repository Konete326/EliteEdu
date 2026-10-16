import { useState } from 'react';
import { Copy, Check, Trash2, Clock } from 'lucide-react';
import { formatDiagnosticReport, getExpiresInDays } from '../../../utils/logDiagnosticsFormatter';

const getCategoryBadge = (cat) => {
  switch (cat) {
    case 'NETWORK_ERROR': return 'bg-bad/10 text-bad border-bad/20';
    case 'CONSOLE_ERROR': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'RUNTIME_ERROR': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    case 'SERVER_ERROR': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    default: return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  }
};

const LogsTableRow = ({ log, isSelected, onSelect, onDelete, isSuperAdmin }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = formatDiagnosticReport(log);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(log);
  };

  return (
    <tr
      onClick={() => onSelect(log)}
      className={`border-b border-line/60 dark:border-line-dark/60 text-xs transition-colors cursor-pointer select-none ${
        isSelected
          ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary'
          : 'hover:bg-surface-secondary/40 dark:hover:bg-surface-secondary-dark/30'
      }`}
    >
      <td className="py-2.5 px-3 whitespace-nowrap">
        <div className="font-semibold text-ink dark:text-ink-dark">
          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark flex items-center gap-1 mt-0.5">
          <Clock className="w-2.5 h-2.5 text-primary" />
          <span>{getExpiresInDays(log.createdAt)}</span>
        </div>
      </td>

      <td className="py-2.5 px-3 whitespace-nowrap">
        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadge(log.category)}`}>
          {log.category.replace('_', ' ')}
        </span>
        <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark truncate max-w-[120px] mt-0.5">
          {log.school_name || 'Global'}
        </div>
      </td>

      <td className="py-2.5 px-3 whitespace-nowrap">
        <div className="font-medium text-ink dark:text-ink-dark truncate max-w-[110px]">
          {log.user_name}
        </div>
        <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark">
          {log.user_role}
        </span>
      </td>

      <td className="py-2.5 px-3 max-w-[180px]">
        <div className="text-[11px] font-medium text-primary dark:text-primary-dark truncate" title={log.last_clicked_element}>
          {log.last_clicked_element || 'Direct / Initial Load'}
        </div>
        <div className="text-ink-sub dark:text-ink-sub-dark truncate text-[11px] mt-0.5" title={log.message}>
          {log.message}
        </div>
      </td>

      <td className="py-2.5 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
            title="Copy diagnostic report"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-bad hover:bg-bad/10 transition-all cursor-pointer"
              title="Delete log"
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
