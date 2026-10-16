import { Search, MapPin } from 'lucide-react';

const STATUS_OPTIONS = ['Pending Verification', 'Verified', 'Approved', 'Converted', 'Rejected'];
const DEPARTMENT_OPTIONS = ['Academics', 'Administration', 'Science', 'Mathematics', 'English', 'Sales', 'Marketing', 'Sports'];
const AVAILABILITY_OPTIONS = ['Full Time', 'Part Time', 'Contract', 'Visiting'];

const ApplicantFiltersRow = ({
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  selectedStatus,
  onStatusChange,
  selectedDepartment,
  onDepartmentChange,
  selectedAvailability,
  onAvailabilityChange,
  isMapView,
  onToggleMapView
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-line/60 dark:border-white/5">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, department, contact..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none focus:border-primary/60"
        />
      </div>

      <select
        value={selectedCampus}
        onChange={(e) => onCampusChange(e.target.value)}
        className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-medium"
      >
        <option value="all">All Campuses</option>
        {campuses.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-medium"
      >
        <option value="all">All Statuses</option>
        {STATUS_OPTIONS.map((st) => (
          <option key={st} value={st}>{st}</option>
        ))}
      </select>

      <select
        value={selectedDepartment}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-medium"
      >
        <option value="all">All Departments</option>
        {DEPARTMENT_OPTIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={selectedAvailability}
        onChange={(e) => onAvailabilityChange(e.target.value)}
        className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-medium"
      >
        <option value="all">All Availability</option>
        {AVAILABILITY_OPTIONS.map((av) => (
          <option key={av} value={av}>{av}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={onToggleMapView}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
          isMapView
            ? 'border-primary bg-primary-soft dark:bg-primary/20 text-primary'
            : 'border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark'
        }`}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Applicant Map View</span>
      </button>
    </div>
  );
};

export default ApplicantFiltersRow;
