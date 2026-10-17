const MasterReportFilterInputs = ({ filters = {}, onFilterChange, grades = [] }) => {
  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Academic Year</label>
        <select
          value={filters.academic_session || '2026-2027'}
          onChange={(e) => onFilterChange('academic_session', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
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
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Gender</label>
        <select
          value={filters.gender || 'all'}
          onChange={(e) => onFilterChange('gender', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
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
          placeholder="Type name or GR..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Religion</label>
        <select
          value={filters.religion || 'all'}
          onChange={(e) => onFilterChange('religion', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Religions</option>
          <option value="Islam">Islam</option>
          <option value="Christianity">Christianity</option>
          <option value="Hinduism">Hinduism</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Transport Route</label>
        <input
          type="text"
          value={filters.transport_route || ''}
          onChange={(e) => onFilterChange('transport_route', e.target.value)}
          placeholder="Route #"
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Discount Ref</label>
        <input
          type="text"
          value={filters.discount_reference || ''}
          onChange={(e) => onFilterChange('discount_reference', e.target.value)}
          placeholder="Scholarship..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        />
      </div>
    </>
  );
};

export default MasterReportFilterInputs;
