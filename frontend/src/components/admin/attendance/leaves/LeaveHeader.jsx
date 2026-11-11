import { CalendarCheck, Plus, Printer, RefreshCw } from 'lucide-react';

const LeaveHeader = ({
  onNewLeave,
  onReload,
  loading = false
}) => {
  return (
    <div className="p-3 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            Leave Applications
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-ink-muted hidden sm:block">
            Formal applications, multi-tier approvals, and automated attendance register synchronization
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-primary' : ''} />
          <span>{loading ? 'Refreshing...' : 'Reload'}</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary transition-all cursor-pointer shadow-2xs"
        >
          <Printer size={13} />
          <span>Print</span>
        </button>

        <button
          type="button"
          onClick={onNewLeave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer ml-auto sm:ml-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Leave</span>
        </button>
      </div>
    </div>
  );
};

export default LeaveHeader;
