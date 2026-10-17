import { Search, RotateCw, Filter } from 'lucide-react';

const ReportClassFilterCard = ({
  grades = [],
  selectedGrade = 'all',
  onGradeChange,
  selectedSection = 'all',
  onSectionChange,
  onSearch,
  onReload,
  loading = false,
  showStatusFilter = false,
  selectedStatus = 'all',
  onStatusChange
}) => {
  const activeGradeObj = grades.find((g) => String(g._id) === String(selectedGrade));
  const availableSections = activeGradeObj?.sections || ['A', 'B', 'C', 'D'];

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-line text-xs font-bold text-ink uppercase tracking-wider">
        <Filter size={14} className="text-primary" />
        <span>1 Filter by Class</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Class / Grade
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-medium cursor-pointer"
          >
            <option value="all">All Classes</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => onSectionChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-medium cursor-pointer"
          >
            <option value="all">All Sections</option>
            {availableSections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>

        {showStatusFilter && (
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Enrollment Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Registered">Registered</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Left">Left</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Search size={13} />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
            title="Reset Filters"
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportClassFilterCard;
