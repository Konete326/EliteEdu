import { useState } from 'react';
import { X, Copy, Check, Trash2 } from 'lucide-react';
import { formatDiagnosticReport } from '../../../utils/logDiagnosticsFormatter';
import LogDetailBody from './LogDetailBody';

const SEVERITY_COLORS = {
  CRITICAL: 'bg-bad/15 text-bad border-bad/30',
  ERROR: 'bg-bad/10 text-bad border-bad/20',
  WARNING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  INFO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
};

const LogDetailModal = ({ isOpen, onClose, log, onDeleteLog, isSuperAdmin }) => {
  const [copiedType, setCopiedType] = useState(null);

  if (!isOpen || !log) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const sevBadge = SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.INFO;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between gap-3 bg-surface-secondary/40">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${sevBadge}`}>
              {log.severity || 'INFO'}
            </span>
            <span className="text-xs font-bold text-ink dark:text-ink-dark">{log.category}</span>
            <span className="text-[11px] text-ink-muted">• ID: {log._id?.slice(-8)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopy(formatDiagnosticReport(log), 'report')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary transition-all cursor-pointer"
            >
              {copiedType === 'report' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'report' ? 'Report Copied' : 'Copy Report'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(log, null, 2), 'json')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary transition-all cursor-pointer"
            >
              {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'json' ? 'JSON Copied' : 'Copy JSON'}</span>
            </button>
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => { onDeleteLog(log); onClose(); }}
                className="p-1.5 rounded-lg text-bad hover:bg-bad/10 transition-all cursor-pointer"
                title="Delete log"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <LogDetailBody log={log} copiedType={copiedType} onCopy={handleCopy} />
      </div>
    </div>
  );
};

export default LogDetailModal;
