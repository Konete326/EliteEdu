import { Sparkles, Landmark, Calendar, Printer, Search, RefreshCw } from 'lucide-react';

const FeeCollectionActionBar = ({
  onGenerateClick,
  onSettingsClick,
  onDueDateClick,
  onPrintClick,
  search,
  onSearchChange,
  gradeFilter,
  onGradeChange,
  statusFilter,
  onStatusChange,
  monthFilter,
  onMonthChange,
  grades = [],
  onRefresh
}) => {
  return (
    <div className="space-y-4">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark uppercase tracking-tight">Fee Counter &amp; POS Terminal</h1>
          <p className="text-xs font-semibold text-ink-muted">Manage invoices, collect student fees, and print Pakistani 3-copy bank challans</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onGenerateClick} className="px-3 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Generate Challans</span>
          </button>
          <button type="button" onClick={onSettingsClick} className="px-3 py-2 rounded-xl text-xs font-bold border border-line bg-surface text-ink hover:bg-surface-secondary flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-primary" />
            <span>Bank Settings</span>
          </button>
          <button type="button" onClick={onDueDateClick} className="px-3 py-2 rounded-xl text-xs font-bold border border-line bg-surface text-ink hover:bg-surface-secondary flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Update Due Date</span>
          </button>
          <button type="button" onClick={onPrintClick} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-1.5 shadow-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Print 3-Copy Challans</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Challan #, Student Name, or GR #..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-line bg-surface-secondary/30 text-ink outline-none"
          />
        </div>
        <select value={gradeFilter} onChange={(e) => onGradeChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
          <option value="">All Grades</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
          <option value="">All Statuses</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <input type="month" value={monthFilter} onChange={(e) => onMonthChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        <button type="button" onClick={onRefresh} className="p-2 rounded-xl border border-line text-ink-muted hover:text-primary"><RefreshCw className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

export default FeeCollectionActionBar;
