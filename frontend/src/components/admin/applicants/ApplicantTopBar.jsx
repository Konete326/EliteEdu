import { Link } from 'react-router-dom';
import { Link2, SlidersHorizontal, Plus } from 'lucide-react';
import ApplicantFiltersRow from './ApplicantFiltersRow';

const ApplicantTopBar = ({
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
  onCopyLink,
  onOpenCustomize,
  isMapView,
  onToggleMapView
}) => {
  return (
    <div className="sticky top-[1px] z-10 mt-[1px] space-y-4 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">
            Staff Applicants
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            HR Recruitment &amp; Hiring Pipeline — Evaluate candidates &amp; enroll into faculty
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#141414] text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Link2 className="w-3.5 h-3.5 text-primary" />
            <span>Generate Link</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#141414] text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted" />
            <span>Customize Form</span>
          </button>

          <Link
            to="/admin/staff-applicants/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Applicant</span>
          </Link>
        </div>
      </div>

      <ApplicantFiltersRow
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={onCampusChange}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={onDepartmentChange}
        selectedAvailability={selectedAvailability}
        onAvailabilityChange={onAvailabilityChange}
        isMapView={isMapView}
        onToggleMapView={onToggleMapView}
      />
    </div>
  );
};

export default ApplicantTopBar;
