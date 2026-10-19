import { Search } from 'lucide-react';

const FeeConcessionsHeader = ({ stats = {}, search, onSearchChange, gradeFilter, onGradeChange, grades = [], onlyDiscounted, onToggleOnlyDiscounted }) => {
  return (
    <div className="space-y-4">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark uppercase tracking-tight">Fee Concessions &amp; Scholarships</h1>
          <p className="text-xs font-semibold text-ink-muted">Manage sibling discounts, merit scholarships, orphan concessions, and institutional aid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-1">
          <span className="text-xs font-bold text-ink-muted uppercase">Monthly Scholarship Budget</span>
          <div className="text-xl font-black text-primary font-mono">PKR {Number(stats.total_scholarship_monthly || 0).toLocaleString()}</div>
          <p className="text-[11px] text-ink-muted">Cumulative institutional concession per month</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-1">
          <span className="text-xs font-bold text-ink-muted uppercase">Beneficiary Students</span>
          <div className="text-xl font-black text-emerald-500 font-mono">{stats.discounted_students_count || 0}</div>
          <p className="text-[11px] text-ink-muted">Students receiving scholarships or discounts</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-1">
          <span className="text-xs font-bold text-ink-muted uppercase">Average Concession</span>
          <div className="text-xl font-black text-amber-500 font-mono">
            PKR {stats.discounted_students_count > 0 ? Math.round(stats.total_scholarship_monthly / stats.discounted_students_count).toLocaleString() : 0}
          </div>
          <p className="text-[11px] text-ink-muted">Average discount per beneficiary</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-line text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student by name, GR #, or concession category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-line bg-surface-secondary/30 text-ink outline-none"
          />
        </div>
        <select value={gradeFilter} onChange={(e) => onGradeChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
          <option value="">All Classes</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <label className="flex items-center gap-1.5 cursor-pointer text-ink font-semibold">
          <input type="checkbox" checked={onlyDiscounted} onChange={(e) => onToggleOnlyDiscounted(e.target.checked)} className="rounded" />
          <span>Show Beneficiaries Only</span>
        </label>
      </div>
    </div>
  );
};

export default FeeConcessionsHeader;
