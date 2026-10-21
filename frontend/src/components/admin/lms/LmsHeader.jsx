import { BookOpen, RefreshCw, Building2, Sparkles } from 'lucide-react';

const LmsHeader = ({ campusName = 'Main Campus', onRefresh, loading = false, totalCount = 0 }) => {
  return (
    <div className="p-3.5 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 print:hidden">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-xl font-black text-ink dark:text-white tracking-tight truncate">
              Digital Classroom &amp; LMS Studio
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={11} />
              <span>Smart LMS</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-ink-muted line-clamp-1 sm:line-clamp-none">
            Curriculum tracking, homework dispatch, lecture resources, quizzes, and live classrooms
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block leading-none">Active Scope</span>
            <span className="font-black text-primary text-xs">{campusName || 'All Campuses'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark hover:bg-line dark:hover:bg-line-dark text-ink dark:text-white text-xs sm:text-sm font-bold border border-line dark:border-line-dark shadow-xs transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? 'animate-spin' : ''}`} />
          <span>Sync LMS</span>
          {totalCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-mono text-[10px]">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default LmsHeader;
