import { ArrowLeftRight, Building2, Plus } from 'lucide-react';

const TransferHeader = ({ totalTransfers = 0, onInitiateTransfer }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Inter-Campus Student Transfer Hub</h1>
          <p className="text-xs font-semibold text-ink-muted">Seamless branch transfer, historical routing ledger and official transfer order issuance</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block">Completed</span>
            <span className="font-black text-primary">{totalTransfers} Records</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onInitiateTransfer}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campus Transfer</span>
        </button>
      </div>
    </div>
  );
};

export default TransferHeader;
