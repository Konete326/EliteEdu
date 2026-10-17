import { Search, UserCheck } from 'lucide-react';

const ReportCardStudentSelector = ({
  students = [],
  selectedStudentId,
  onSelectStudent,
  grades = [],
  selectedGrade,
  onGradeChange,
  searchTerm,
  onSearchChange,
  loading = false
}) => {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-3.5 print:hidden">
      <div>
        <h2 className="text-xs font-black uppercase tracking-wider text-ink">
          Find Student Report Card
        </h2>
        <p className="text-[11px] text-ink-muted mt-0.5">
          Select class or search by name or GR #
        </p>
      </div>

      <div className="space-y-2">
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-medium cursor-pointer"
        >
          <option value="all">All Classes</option>
          {grades.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type student name or GR #..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface text-ink placeholder:text-ink-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-ink-muted">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">No students found.</div>
        ) : (
          students.map((st) => {
            const isSelected = String(st._id) === String(selectedStudentId);
            return (
              <button
                key={st._id}
                type="button"
                onClick={() => onSelectStudent(st._id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-line hover:border-primary/40 bg-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-secondary text-ink-sub'
                    }`}
                  >
                    {st.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-ink truncate">{st.name}</p>
                    <p className="text-[10px] text-ink-muted">
                      GR: {st.gr_number} • {st.current_grade?.name || 'Class'} ({st.current_section || 'A'})
                    </p>
                  </div>
                </div>
                {isSelected && <UserCheck size={14} className="text-primary shrink-0 ml-1" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReportCardStudentSelector;
