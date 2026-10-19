const StudentFilterInputs = ({ filters = {}, onFilterChange, grades = [] }) => {
  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Academic Year</label>
        <select
          value={filters.academic_session || '2026-2027'}
          onChange={(e) => onFilterChange('academic_session', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Sessions</option>
          <option value="2026-2027">2026-2027</option>
          <option value="2025-2026">2025-2026</option>
        </select>
      </div>

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
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Section</label>
        <select
          value={filters.section || 'all'}
          onChange={(e) => onFilterChange('section', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Sections</option>
          {['A', 'B', 'C', 'D'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All</option>
          <option value="Active">Active</option>
          <option value="Registered">Registered</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
          <option value="Left">Left</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search Name / GR</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Name or GR..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>
    </>
  );
};

export default StudentFilterInputs;
