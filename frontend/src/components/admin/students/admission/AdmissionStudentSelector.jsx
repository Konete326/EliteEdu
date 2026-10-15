import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import AdmissionStudentItem from './AdmissionStudentItem';

const AdmissionStudentSelector = ({
  students = [],
  selectedStudent,
  onSelectStudent,
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  grades = [],
  selectedGrade,
  onGradeChange,
  currentPage,
  totalPages,
  onPageChange,
  loading
}) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 print:hidden">
      <div>
        <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Student Directory</h2>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Pick a student to generate or print admission form</p>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, GR #, phone..."
          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark text-[11px] font-medium outline-none cursor-pointer"
        >
          <option value="">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark text-[11px] font-medium outline-none cursor-pointer"
        >
          <option value="">All Classes</option>
          {grades.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs text-center text-ink-muted py-8">Loading student records...</p>
        ) : students.length === 0 ? (
          <p className="text-xs text-center text-ink-muted py-8">No students found.</p>
        ) : (
          students.map((student) => (
            <AdmissionStudentItem
              key={student._id}
              student={student}
              isSelected={selectedStudent?._id === student._id}
              onSelect={onSelectStudent}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-line/60 dark:border-line-dark text-xs text-ink-muted">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onPageChange(1)} disabled={currentPage <= 1} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-40">
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-40">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] font-medium">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-40">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages} className="p-1 rounded hover:bg-surface-secondary disabled:opacity-40">
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionStudentSelector;
