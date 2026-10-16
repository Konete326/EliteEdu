import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const LogDetailModal = ({ log, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!log) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-line-dark">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Log Event Details</h3>
            <span className="text-[11px] text-ink-muted">{log._id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-surface-secondary/40 p-3 rounded-xl">
            <div>
              <span className="text-ink-muted block text-[10px] uppercase font-bold">Category / Severity</span>
              <span className="font-semibold text-ink dark:text-ink-dark">{log.category} · {log.severity}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px] uppercase font-bold">User</span>
              <span className="font-semibold text-ink dark:text-ink-dark">{log.user_name || 'Anonymous'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-ink-muted block text-[10px] uppercase font-bold">Message</span>
              <span className="font-medium text-ink dark:text-ink-dark">{log.message || '—'}</span>
            </div>
            {log.endpoint && (
              <div className="col-span-2">
                <span className="text-ink-muted block text-[10px] uppercase font-bold">Endpoint</span>
                <span className="font-mono text-ink dark:text-ink-dark">{log.endpoint}</span>
              </div>
            )}
            {log.page_url && (
              <div className="col-span-2">
                <span className="text-ink-muted block text-[10px] uppercase font-bold">Page URL</span>
                <span className="font-mono text-ink dark:text-ink-dark">{log.page_url}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-ink-muted uppercase">Payload & Metadata</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-good" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
              {JSON.stringify(log.payload || log, null, 2)}
            </pre>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-line dark:border-line-dark flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-secondary text-ink hover:bg-line transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
