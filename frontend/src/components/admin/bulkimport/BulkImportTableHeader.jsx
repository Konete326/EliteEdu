const BulkImportTableHeader = ({ summary, filter, setFilter }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-ink dark:text-ink-dark">Dry-Run Inspection</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-surface-secondary text-ink-muted">
          {summary.total} Rows Total
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {summary.validCount} Ready
        </span>
        {summary.errorCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            {summary.errorCount} Issues
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-secondary dark:bg-white/5 border border-line">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${filter === 'all' ? 'bg-surface dark:bg-surface-dark text-ink shadow-xs' : 'text-ink-muted'}`}
        >
          All ({summary.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter('valid')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${filter === 'valid' ? 'bg-surface dark:bg-surface-dark text-emerald-600 shadow-xs' : 'text-ink-muted'}`}
        >
          Ready ({summary.validCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('invalid')}
          className={`px-2 py-1 rounded text-[10px] font-bold ${filter === 'invalid' ? 'bg-surface dark:bg-surface-dark text-rose-600 shadow-xs' : 'text-ink-muted'}`}
        >
          Errors ({summary.errorCount})
        </button>
      </div>
    </div>
  );
};

export default BulkImportTableHeader;
