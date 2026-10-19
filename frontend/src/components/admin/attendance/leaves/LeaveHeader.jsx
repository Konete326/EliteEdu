import { CalendarCheck, Plus, Printer, RefreshCw } from 'lucide-react';

const LeaveHeader = ({
  totalLeaves = 0,
  onNewLeave,
  onReload,
  loading = false
}) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            Institutional Leave Management &amp; Absences
          </h1>
          <p className="text-xs font-semibold text-ink-muted">
            Formal applications, multi-tier approvals, leave slips and automated attendance register synchronization
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block">Registered</span>
            <span className="font-black text-primary">{totalLeaves} Applications</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReload}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Reload</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-all cursor-pointer shadow-2xs"
        >
          <Printer size={13} />
          <span>Print Sheet</span>
        </button>

        <button
          type="button"
          onClick={onNewLeave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Leave Application</span>
        </button>
      </div>
    </div>
  );
};

export default LeaveHeader;
