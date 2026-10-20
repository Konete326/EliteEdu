import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Printer, BarChart3, CheckCheck, XCircle, Clock, AlertCircle } from 'lucide-react';
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
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-4 shadow-xs space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Select Class
          </label>
          <ClassSearchableSelect
            grades={grades}
            selectedGradeId={selectedGradeId}
            onGradeChange={onGradeChange}
            placeholder="Type class name or select..."
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Select Section
          </label>
          <div className="relative">
            <select
              value={selectedSection}
              disabled={!selectedGradeId}
              onChange={(e) => onSectionChange(e.target.value)}
              className="w-full appearance-none bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!selectedGradeId ? (
                <option value="">Select Class first</option>
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
            <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center justify-end gap-2 flex-wrap">
          <button
            type="button"
            onClick={onShow}
            disabled={!selectedGradeId || loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Show'}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || !loaded || !hasRecords}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <div className="relative" ref={bulkMenuRef}>
            <button
              type="button"
              onClick={() => setBulkMenuOpen((prev) => !prev)}
              disabled={!loaded || !hasRecords}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Bulk Mark</span>
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
            title="Attendance Statistics & Analytics"
            onClick={onOpenStats}
            className="p-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
          </button>

          <button
            type="button"
            title="Print Attendance Sheet"
            onClick={onPrint}
            className="p-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end pt-1">
        <div className="lg:col-span-9">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or gr"
            className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1.5">
            Sort By
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3.5 py-2 text-xs font-medium text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="roll">Roll / GR</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceFilterBar;
