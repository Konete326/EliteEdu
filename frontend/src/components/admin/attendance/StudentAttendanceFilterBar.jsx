import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Printer, BarChart3, CheckCheck, XCircle, Clock, AlertCircle, RefreshCw, Check } from 'lucide-react';
import ClassSearchableSelect from './ClassSearchableSelect';

const StudentAttendanceFilterBar = ({
  grades = [],
  selectedGradeId,
  onGradeChange,
  sections = [],
  selectedSection,
  onSectionChange,
  date,
  onDateChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onShow,
  onSave,
  onMarkAll,
  onOpenStats,
  onPrint,
  loading,
  saving,
  loaded,
  hasRecords
}) => {
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const bulkMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target)) {
        setBulkMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBulkSelect = (status) => {
    onMarkAll(status);
    setBulkMenuOpen(false);
  };

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs space-y-2 sm:space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-3 items-end">
        <div className="col-span-1 lg:col-span-3">
          <label className="block text-[10px] sm:text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Class
          </label>
          <ClassSearchableSelect
            grades={grades}
            selectedGradeId={selectedGradeId}
            onGradeChange={onGradeChange}
            placeholder="Select class..."
          />
        </div>

        <div className="col-span-1 lg:col-span-3">
          <label className="block text-[10px] sm:text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Section
          </label>
          <div className="relative">
            <select
              value={selectedSection}
              disabled={!selectedGradeId}
              onChange={(e) => onSectionChange(e.target.value)}
              className="w-full appearance-none bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!selectedGradeId ? (
                <option value="">Select Class</option>
              ) : (
                <>
                  <option value="">All Sections</option>
                  {sections.map((sec, idx) => {
                    const val = typeof sec === 'string' ? sec : sec.name || `Section ${idx + 1}`;
                    return (
                      <option key={val} value={val}>
                        Section {val}
                      </option>
                    );
                  })}
                </>
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <label className="block text-[10px] sm:text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer"
          />
        </div>

        <div className="col-span-2 sm:col-span-1 lg:col-span-4 flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onShow}
            disabled={!selectedGradeId || loading}
            title="Reload latest sheet"
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark hover:bg-surface-secondary/80 text-ink dark:text-ink-dark border border-line dark:border-line-dark transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || !loaded || !hasRecords}
            className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5 min-h-[36px]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>

          <div className="relative shrink-0" ref={bulkMenuRef}>
            <button
              type="button"
              onClick={() => setBulkMenuOpen((prev) => !prev)}
              disabled={!loaded || !hasRecords}
              className="px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1 disabled:opacity-40 min-h-[36px]"
            >
              <span>Mark</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            </button>

            {bulkMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl shadow-xl py-1.5 z-30">
                <button
                  type="button"
                  onClick={() => handleBulkSelect('P')}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSelect('A')}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark All Absent</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSelect('LT')}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-amber-600 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mark All Late</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSelect('L')}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-sky-600 hover:bg-sky-50/60 dark:hover:bg-sky-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mark All Leave</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            title="Attendance Statistics"
            onClick={onOpenStats}
            className="p-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-primary hover:border-primary transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
          </button>

          <button
            type="button"
            title="Print Attendance Sheet"
            onClick={onPrint}
            className="p-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-primary hover:border-primary transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student, roll, or GR..."
            className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="w-28 sm:w-36 shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="roll">Sort: Roll/GR</option>
              <option value="status">Sort: Status</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceFilterBar;
