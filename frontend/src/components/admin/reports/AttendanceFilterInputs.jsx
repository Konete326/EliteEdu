const AttendanceFilterInputs = ({ filters = {}, onFilterChange, grades = [], isStaff = false }) => {
  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Date</label>
        <input
          type="date"
          value={filters.date || new Date().toISOString().split('T')[0]}
          onChange={(e) => onFilterChange('date', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        />
      </div>

      {!isStaff ? (
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
      ) : (
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
          </select>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Status</label>
        <select
          value={filters.status_target || 'all'}
          onChange={(e) => onFilterChange('status_target', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Records</option>
          <option value="P">P - Present</option>
          <option value="A">A - Absent</option>
          <option value="L">L - Leave</option>
          <option value="LT">LT - Late Comers</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Name or ID..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>
    </>
  );
};

export default AttendanceFilterInputs;
