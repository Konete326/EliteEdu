import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const NotificationPagination = ({ page = 1, totalPages = 1, total = 0, limit = 6, onPageChange, onLimitChange }) => {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs text-xs">
      <div className="flex items-center gap-3 text-ink-muted">
        <span>
          Showing <span className="font-bold text-ink dark:text-ink-dark">{startItem}–{endItem}</span> of{' '}
          <span className="font-bold text-ink dark:text-ink-dark">{total}</span> notifications
        </span>
        {onLimitChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-line dark:border-white/10">
            <span className="text-[11px]">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="py-0.5 px-2 rounded-lg bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1 || total === 0}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || total === 0}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={total === 0}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              p === page
                ? 'bg-primary text-white shadow-xs'
                : 'border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || total === 0}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages || total === 0}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPagination;
