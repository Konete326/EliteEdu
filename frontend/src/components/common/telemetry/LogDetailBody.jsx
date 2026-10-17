import { Globe, User, MousePointerClick, Terminal, Clock, Copy, Check } from 'lucide-react';
import { getExpiresInDays } from '../../../utils/logDiagnosticsFormatter';

const LogDetailBody = ({ log, copiedType, onCopy }) => {
  return (
    <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark space-y-1">
          <span className="text-[10px] font-bold text-ink-muted uppercase">Endpoint & Target</span>
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

        <div className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark space-y-1">
          <span className="text-[10px] font-bold text-ink-muted uppercase">User & School</span>
          <div className="flex items-center gap-1.5 font-semibold text-ink dark:text-ink-dark">
            <User className="w-3.5 h-3.5 shrink-0 text-primary" />
            <span>{log.user_name || 'Anonymous'}</span>
            <span className="text-ink-muted font-normal">({log.school_name || 'Global System'})</span>
          </div>
        </div>
      </div>

      {log.last_clicked_element && (
        <div className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark space-y-1">
          <span className="text-[10px] font-bold text-ink-muted uppercase">Last Interacted Element</span>
          <div className="flex items-center gap-1.5 text-primary font-semibold break-all">
            <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
            <span>{log.last_clicked_element}</span>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-ink-muted uppercase">Message</span>
        <div className="p-3 rounded-xl bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border border-line dark:border-line-dark font-mono text-ink dark:text-ink-dark break-all leading-relaxed">
          {log.message}
        </div>
      </div>

      {log.stack_trace && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-ink-muted uppercase flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Stack Trace
            </span>
            <button
              type="button"
              onClick={() => onCopy(log.stack_trace, 'stack')}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              {copiedType === 'stack' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedType === 'stack' ? 'Copied' : 'Copy Stack'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-black/90 text-emerald-400 font-mono text-[10.5px] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap break-all border border-emerald-500/20">
            {log.stack_trace}
          </pre>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 text-[11px] text-ink-muted border-t border-line dark:border-line-dark">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Created: {new Date(log.createdAt).toLocaleString()}
        </span>
        <span>Auto-Purge in {getExpiresInDays(log.createdAt)}</span>
      </div>
    </div>
  );
};

export default LogDetailBody;
