import React from 'react';
import { ChevronDown, ArrowRightLeft, Calendar, FileSpreadsheet, Sun, Trash2, ArrowUpDown } from 'lucide-react';

const StaffAttendanceFilterBar = ({
  department,
  onDepartmentChange,
  date,
  onDateChange,
  search,
  onSearchChange,
  onToggleSort,
  onShow,
  onSave,
  onTransferAttendance,
  onMarkHoliday,
  onReport,
  onMarkSunday,
  onReset,
  loading,
  saving,
  loaded
}) => {
  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-4 shadow-xs space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
        <div className="lg:col-span-4">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Department
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full appearance-none bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Academic">Academic</option>
              <option value="Administration">Administration</option>
              <option value="Accounts">Accounts & Finance</option>
              <option value="Transport">Transport</option>
              <option value="Support Staff">Support Staff</option>
            </select>
            <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
          />
        </div>

        <div className="lg:col-span-6 flex items-center justify-end gap-2 flex-wrap">
          <button
            type="button"
            onClick={onShow}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Show'}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || !loaded}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onTransferAttendance}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Transfer Attendance</span>
          </button>

          <button
            type="button"
            onClick={onMarkHoliday}
            disabled={!loaded}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Mark Holiday</span>
          </button>

          <button
            type="button"
            onClick={onReport}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Report</span>
          </button>

          <button
            type="button"
            onClick={onMarkSunday}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Mark Sunday</span>
          </button>

          <button
            type="button"
            title="Reset Today's Attendance"
            onClick={onReset}
            disabled={!loaded}
            className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or father name"
            className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <button
          type="button"
          onClick={onToggleSort}
          title="Toggle Sort (Name / S.No / Status)"
          className="p-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-primary hover:border-primary transition-all cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StaffAttendanceFilterBar;
