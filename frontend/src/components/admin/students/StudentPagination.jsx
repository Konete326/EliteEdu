import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const StudentPagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalItems === 0) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line dark:border-white/10 text-xs text-ink-muted dark:text-ink-muted-dark">
      <span className="font-medium">
        Showing <strong className="text-ink dark:text-white">{startItem}–{endItem}</strong> of <strong className="text-ink dark:text-white">{totalItems}</strong> students
      </span>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1c1c1c] text-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1c1c1c] text-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-ink-muted select-none">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  p === currentPage
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1c1c1c] text-ink dark:text-white'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <div className="sm:hidden px-2 font-bold text-ink dark:text-white">
          Page {currentPage} of {totalPages}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1c1c1c] text-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1c1c1c] text-ink dark:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StudentPagination;
