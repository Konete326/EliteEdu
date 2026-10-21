import { BarChart3, Printer, Building2 } from 'lucide-react';

const AttendanceReportHeader = ({ activeCampusName = 'Main Campus' }) => {
  return (
    <div className="p-3.5 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 print:hidden">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight truncate">
            Institutional Attendance Studio &amp; Registers
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-ink-muted line-clamp-1 sm:line-clamp-none">
            Class-wise roll calls, 31-day registers, monthly matrix, and automated attendance analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block">Active Scope</span>
            <span className="font-black text-primary">{activeCampusName || 'All Campuses'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Register</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceReportHeader;
