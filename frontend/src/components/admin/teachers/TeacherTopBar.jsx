import { Plus, Search, X, CreditCard, CalendarCheck, Users, Building2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchableSelect from '../../common/SearchableSelect';

const TeacherTopBar = ({
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  designations = [],
  selectedDesignation,
  onDesignationChange
}) => {
  const campusOptions = [
    { value: 'all', label: 'All Campuses' },
    ...campuses.map((c) => ({ value: c._id, label: c.name }))
  ];

  const designationOptions = [
    { value: 'all', label: 'All Designations' },
    ...designations.map((d) => ({ value: d, label: d }))
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-ink dark:text-white tracking-tight">
              Staff &amp; Faculty Directory
            </h1>
            <p className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark">
              Faculty roster, live period tracking and attendance
            </p>
          </div>
        </div>

        <div className="relative flex-1 max-w-md sm:ml-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search faculty by name, phone, code..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-surface-secondary/50 dark:bg-[#181818] border border-line dark:border-white/10 text-ink dark:text-white placeholder:text-ink-muted outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <div className="w-36 sm:w-44">
          <SearchableSelect
            options={campusOptions}
            value={selectedCampus}
            onChange={onCampusChange}
            icon={Building2}
            size="sm"
            placeholder="Campus..."
          />
        </div>

        <div className="w-36 sm:w-44">
          <SearchableSelect
            options={designationOptions}
            value={selectedDesignation}
            onChange={onDesignationChange}
            icon={Briefcase}
            size="sm"
            placeholder="Designation..."
          />
        </div>

        <Link
          to="/admin/teachers/id-cards"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] hover:bg-surface-secondary text-ink dark:text-white text-xs font-semibold transition-all shadow-xs shrink-0"
        >
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Service Cards</span>
        </Link>

        <Link
          to="/admin/attendance/employees"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] hover:bg-surface-secondary text-ink dark:text-white text-xs font-semibold transition-all shadow-xs shrink-0"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Staff Attendance</span>
        </Link>

        <Link
          to="/admin/teachers/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherTopBar;