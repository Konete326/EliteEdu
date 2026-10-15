import { Link } from 'react-router-dom';
import { Search, Link2, SlidersHorizontal, Plus, MapPin } from 'lucide-react';

const STATUS_OPTIONS = ['Pending Verification', 'Verified', 'Approved', 'Converted', 'Rejected'];
const DEPARTMENT_OPTIONS = ['Academics', 'Administration', 'Science', 'Mathematics', 'English', 'Sales', 'Marketing', 'Sports'];
const AVAILABILITY_OPTIONS = ['Full Time', 'Part Time', 'Contract', 'Visiting'];

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">
            Staff Applicants
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Manage incoming staff applications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Link2 className="w-3.5 h-3.5 text-primary" />
            <span>Generate Link</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomize}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors shadow-sm"
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

      <div className="flex flex-wrap items-center gap-2.5 bg-surface dark:bg-[#111111] border border-line dark:border-white/10 p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, department, contact..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none focus:border-primary/60"
          />
        </div>

        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
        >
          <option value="all">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
        >
          <option value="all">All Departments</option>
          {DEPARTMENT_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedAvailability}
          onChange={(e) => onAvailabilityChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
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
              : 'border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Applicant Map View</span>
        </button>
      </div>
    </div>
  );
};

export default ApplicantTopBar;
