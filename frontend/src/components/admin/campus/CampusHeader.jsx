import { Link } from 'react-router-dom';
import { Building2, Plus, RotateCw, ArrowLeftRight, Settings2, Compass } from 'lucide-react';

const CampusHeader = ({
  activeCampus,
  onResetActiveCampus,
  onRefresh,
  loading,
  onAddClick,
  totalCount = 0
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-2xs">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
              Campuses & Institutional Branches
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark">
              {totalCount} {totalCount === 1 ? 'Campus' : 'Campuses'}
            </span>
          </div>

          <p className="text-xs text-ink-muted">
            Manage multi-branch physical facilities, student rosters, and faculty distribution
          </p>

          {activeCampus && (
            <div className="flex items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-ink-muted">Active Workspace:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                <Compass size={11} /> {activeCampus.name}
              </span>
              <button
                type="button"
                onClick={onResetActiveCampus}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                (View All)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Refresh campus data"
        >
          <RotateCw size={14} className={loading ? 'animate-spin text-primary' : ''} />
          <span className="hidden sm:inline">Sync</span>
        </button>

        <Link
          to="/admin/campus-transfer"
          className="px-3 py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeftRight size={14} className="text-purple-500" />
          <span className="hidden sm:inline">Transfer Hub</span>
        </Link>

        <Link
          to="/admin/operations"
          className="px-3 py-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Settings2 size={14} className="text-blue-500" />
          <span className="hidden sm:inline">Operations</span>
        </Link>

        <button
          type="button"
          onClick={onAddClick}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Campus</span>
        </button>
      </div>
    </div>
  );
};

export default CampusHeader;
