import { Link } from 'react-router-dom';
import { ArrowLeftRight, Building2, Plus, RotateCw } from 'lucide-react';

const TransferHeader = ({
  totalTransfers = 0,
  onInitiateTransfer,
  onRefresh,
  loading
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-2xs">
          <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
              Inter-Campus Transfers & Relocations
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark">
              {totalTransfers} Records
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Relocate students or faculty between branches with automatic fee migration and official NOC orders
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Refresh ledger"
        >
          <RotateCw size={14} className={loading ? 'animate-spin text-primary' : ''} />
          <span className="hidden sm:inline">Sync</span>
        </button>

        <Link
          to="/admin/campus"
          className="px-3 py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 size={14} className="text-primary" />
          <span className="hidden sm:inline">Branches</span>
        </Link>

        <button
          type="button"
          onClick={onInitiateTransfer}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>New Transfer</span>
        </button>
      </div>
    </div>
  );
};

export default TransferHeader;
