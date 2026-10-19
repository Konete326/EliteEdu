const StaffFilterInputs = ({ filters = {}, onFilterChange, grades = [], isFinance = false }) => {
  if (isFinance) {
    return (
      <>
        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Class</label>
          <select
            value={filters.grade_id || 'all'}
            onChange={(e) => onFilterChange('grade_id', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
          >
            <option value="all">All Classes</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Billing Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
          >
            <option value="all">All</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due / Defaulter</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search Student</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Student name or GR..."
            className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Department</label>
        <select
          value={filters.department || 'all'}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Departments</option>
          <option value="Academics">Academics</option>
          <option value="Administration">Administration</option>
          <option value="Finance">Finance</option>
          <option value="Security">Security</option>
          <option value="Support">Support</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Employment Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search Staff</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Staff name or code..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>
    </>
  );
};

export default StaffFilterInputs;
