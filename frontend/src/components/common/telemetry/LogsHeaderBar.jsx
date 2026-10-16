import { Activity, RefreshCw, Trash2, ShieldCheck, Play, Pause } from 'lucide-react';

const LogsHeaderBar = ({
  user,
  livePolling,
  setLivePolling,
  refreshing,
  onRefresh,
  onOpenClearModal
}) => {
  const isSuperAdmin = user?.role === 'SuperAdmin';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-line dark:border-line-dark">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
            {isSuperAdmin ? 'Global System Telemetry & Error Logs' : 'Campus Audit & Error Logs'}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-Purge: 7 Days TTL
          </span>
        </div>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
          Real-time capture of console crashes, network API failures, clicked actions, and user audits.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setLivePolling(!livePolling)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            livePolling
              ? 'bg-primary/10 border-primary/30 text-primary dark:text-primary-dark'
              : 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark text-ink-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
          title={livePolling ? 'Pause real-time 5s polling' : 'Resume real-time 5s polling'}
        >
          {livePolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{livePolling ? 'Live Stream (5s)' : 'Stream Paused'}</span>
        </button>

        <button
          type="button"
          onClick={() => onRefresh(false)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          <span>Refresh</span>
        </button>

        {isSuperAdmin ? (
          <button
            type="button"
            onClick={onOpenClearModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-bad/10 text-bad hover:bg-bad hover:text-white border border-bad/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-secondary/70 dark:bg-surface-secondary-dark/60 text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Read-Only View</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default LogsHeaderBar;
