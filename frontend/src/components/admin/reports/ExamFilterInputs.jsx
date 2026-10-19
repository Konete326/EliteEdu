const ExamFilterInputs = ({ filters = {}, onFilterChange, grades = [], exams = [], subReport = '' }) => {
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
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Exam *</label>
        <select
          value={filters.exam_id || 'all'}
          onChange={(e) => onFilterChange('exam_id', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs font-semibold"
        >
          <option value="all">All Exams</option>
          {exams.map((ex) => (
            <option key={ex._id} value={ex._id}>{ex.title} ({ex.term_type || 'Term'})</option>
          ))}
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

      {subReport === 'toppers_list' ? (
        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Top N Students</label>
          <input
            type="number"
            min="1"
            max="100"
            value={filters.top_n || 10}
            onChange={(e) => onFilterChange('top_n', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
          />
        </div>
      ) : (
        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Student / Subject..."
            className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
          />
        </div>
      )}
    </>
  );
};

export default ExamFilterInputs;
