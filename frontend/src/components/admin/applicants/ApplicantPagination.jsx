import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const ApplicantPagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalItems === 0) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line dark:border-white/10 text-xs text-ink-muted dark:text-ink-muted-dark">
      <span>
        {startItem}–{endItem} of {totalItems}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
              p === currentPage
                ? 'bg-primary text-white shadow-sm'
                : 'border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ApplicantPagination;
