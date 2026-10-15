import { Plus, Search, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentTopBar = ({
  searchQuery,
  onSearchChange,
  campuses,
  selectedCampus,
  onCampusChange,
  grades,
  selectedGrade,
  onGradeChange,
  totalCount
}) => {
  return (
    <div className="sticky top-0 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">Students</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-secondary dark:bg-[#1a1a1a] text-ink-muted border border-line dark:border-white/10">
              {totalCount} total
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Student roster, enrollment records, and academic status.
          </p>
        </div>

        <div className="relative flex-1 max-w-sm sm:ml-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students (name, GR #, phone, CNIC)..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none focus:border-primary transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Classes</option>
          {grades.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <Link
          to="/admin/students/admission-letter"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-sub dark:text-ink-sub-dark hover:text-primary dark:hover:text-primary-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4 text-primary" />
          <span>Admission Letters</span>
        </Link>

        <Link
          to="/admin/students/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentTopBar;
