import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, RotateCcw } from 'lucide-react';

export default function ExamsFilterBar({ filters, setFilters, onReset, campuses = [], canCreate = true }) {
  return (
    <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search exams by title..." value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} className="w-full text-xs font-semibold pl-9 pr-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <select value={filters.term_type} onChange={(e) => setFilters((f) => ({ ...f, term_type: e.target.value }))} className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="All">All Terms</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="Final Term">Final Term</option>
            <option value="Monthly Test">Monthly Test</option>
            <option value="Send-Up">Send-Up</option>
            <option value="Mock Exam">Mock Exam</option>
          </select>

          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          {campuses.length > 0 && (
            <select value={filters.campus_id} onChange={(e) => setFilters((f) => ({ ...f, campus_id: e.target.value }))} className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
              <option value="">All Campuses</option>
              {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}

          <button type="button" onClick={onReset} className="p-2 rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary transition-colors" title="Reset Filters">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {canCreate && (
            <Link to="/admin/exam-management/exams/new" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Exam</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
