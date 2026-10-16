import { useState } from 'react';
import { Copy, Check, Trash2, Eye, Globe, MousePointerClick, Terminal, Clock } from 'lucide-react';
import { formatDiagnosticReport, getExpiresInDays } from '../../../utils/logDiagnosticsFormatter';

const LogInspectorPanel = ({ log, onDeleteLog, isSuperAdmin }) => {
  const [copied, setCopied] = useState(false);

  if (!log) {
    return (
      <div className="p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex flex-col items-center justify-center text-center min-h-[300px]">
        <Eye className="w-10 h-10 stroke-1 text-primary mb-2 opacity-80" />
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">No Log Selected</h3>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1 max-w-[220px]">
          Click any row in the telemetry stream to inspect full stack traces and failed user actions.
        </p>
      </div>
    );
  }

  const handleCopyReport = () => {
    const text = formatDiagnosticReport(log);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-4 p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3.5 max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex items-center justify-between gap-2 border-b border-line dark:border-line-dark pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary-dark">
            Diagnostic Inspector
          </span>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            <Clock className="w-3 h-3" />
            <span>Auto-Purge in {getExpiresInDays(log.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark hover:bg-line dark:hover:bg-line-dark transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => onDeleteLog(log)}
              className="p-1 rounded-lg text-bad hover:bg-bad/10 transition-all cursor-pointer"
              title="Delete log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line/60 dark:border-line-dark/60 space-y-1">
          <div className="text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase">Last Clicked Action</div>
          <div className="flex items-center gap-1.5 font-semibold text-primary dark:text-primary-dark">
            <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
            <span className="break-all">{log.last_clicked_element || 'None / Page Load'}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line/60 dark:border-line-dark/60 space-y-1">
          <div className="text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase">Endpoint & Target</div>
          <div className="flex items-center gap-1.5 text-ink dark:text-ink-dark font-mono text-[11px] break-all">
            <Globe className="w-3.5 h-3.5 shrink-0 text-ink-muted" />
            <span>{log.method || 'GET'} {log.endpoint || log.page_url || 'N/A'}</span>
            {log.status_code && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${log.status_code >= 400 ? 'bg-bad/15 text-bad' : 'bg-emerald-500/15 text-emerald-600'}`}>
                {log.status_code}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase">Message</div>
          <div className="p-2.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark font-mono text-[11px] text-ink dark:text-ink-dark break-all">
            {log.message}
          </div>
        </div>

        {log.stack_trace && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              <Terminal className="w-3 h-3" />
              <span>Stack Trace</span>
            </div>
            <pre className="p-2.5 rounded-xl bg-black/80 text-emerald-400 font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap break-all border border-emerald-500/20">
              {log.stack_trace}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogInspectorPanel;
