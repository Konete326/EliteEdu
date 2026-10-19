import { Plus, Search, X, CreditCard, CalendarCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherTopBar = ({
  searchQuery,
  onSearchChange,
  campuses,
  selectedCampus,
  onCampusChange,
  designations,
  selectedDesignation,
  onDesignationChange
}) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Staff &amp; Faculty Directory</h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Faculty members, teacher designations and institutional personnel records
            </p>
          </div>
        </div>

        <div className="relative flex-1 max-w-sm sm:ml-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search staff (name, phone, employee ID, CNIC)..."
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
          value={selectedDesignation}
          onChange={(e) => onDesignationChange(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all shadow-sm font-medium cursor-pointer"
        >
          <option value="all">All Designations</option>
          {designations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <Link
          to="/admin/teachers/id-cards"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] hover:bg-surface-secondary text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <CreditCard className="w-4 h-4 text-primary" />
          <span>Service Cards</span>
        </Link>

        <Link
          to="/admin/attendance/employees"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] hover:bg-surface-secondary text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-primary" />
          <span>Staff Attendance</span>
        </Link>

        <Link
          to="/admin/teachers/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherTopBar;
