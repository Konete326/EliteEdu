import { Plus, Search, X, FileText, CreditCard, Award, GraduationCap } from 'lucide-react';
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
  selectedStatus,
  onStatusChange,
  totalCount
}) => {
  return (
    <div className="p-3 sm:p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary dark:text-primary-dark flex items-center justify-center font-bold shrink-0 border border-primary/20">
              <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-black text-ink dark:text-white tracking-tight">Student Directory</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary/10 text-primary dark:text-primary-dark border border-primary/20">
                  {totalCount.toLocaleString()}
                </span>
              </div>
              <p className="hidden sm:block text-xs font-medium text-ink-muted dark:text-ink-muted-dark mt-0.5">
                Student roster, enrollment records, and academic status
              </p>
            </div>
          </div>
          <Link
            to="/admin/students/new"
            className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-sm shadow-primary/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Link>
        </div>

        <div className="relative flex-1 max-w-sm sm:ml-2">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students (name, GR #, phone, CNIC)..."
            className="w-full pl-9 pr-8 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white placeholder:text-ink-muted dark:placeholder:text-ink-muted-dark outline-none focus:border-primary transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Classes</option>
          {grades.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Left">Left / Inactive</option>
        </select>

        <Link
          to="/admin/reports/report-cards"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-sub dark:text-ink-muted-dark hover:text-primary dark:hover:text-primary-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="hidden sm:inline">Report Cards</span>
        </Link>

        <Link
          to="/admin/students/id-cards"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-sub dark:text-ink-muted-dark hover:text-primary dark:hover:text-primary-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="hidden sm:inline">ID Cards</span>
        </Link>

        <Link
          to="/admin/students/admission-letter"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-sub dark:text-ink-muted-dark hover:text-primary dark:hover:text-primary-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="hidden sm:inline">Letters</span>
        </Link>

        <Link
          to="/admin/students/new"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentTopBar;
