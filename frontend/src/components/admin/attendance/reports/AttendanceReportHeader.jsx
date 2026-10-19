import { BarChart3, Printer, Building2 } from 'lucide-react';

const AttendanceReportHeader = ({ activeCampusName = 'Main Campus' }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            Institutional Attendance Studio &amp; Registers
          </h1>
          <p className="text-xs font-semibold text-ink-muted">
            Class-wise roll calls, 31-day registers, monthly matrix, and automated attendance analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Register</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceReportHeader;
