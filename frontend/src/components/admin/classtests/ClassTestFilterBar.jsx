import React from 'react';
import { Search, RotateCcw, List, FileSpreadsheet } from 'lucide-react';

export default function ClassTestFilterBar({ filters, setFilters, onReset, prereqs, activeView, setActiveView, activeTest }) {
  const grades = prereqs?.grades || [];
  const subjects = prereqs?.subjects || [];
  const selectedGradeObj = grades.find((g) => String(g._id) === String(filters.grade_id));
  const sections = selectedGradeObj?.sections || ['A', 'B', 'C', 'D'];

  return (
    <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/30 border border-line dark:border-line-dark">
          <button type="button" onClick={() => setActiveView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeView === 'list' ? 'bg-primary text-white shadow-2xs' : 'text-text-muted hover:text-text-primary'}`}>
            <List className="w-3.5 h-3.5" /> Tests Directory
          </button>
          {activeTest && (
            <button type="button" onClick={() => setActiveView('sheet')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeView === 'sheet' ? 'bg-primary text-white shadow-2xs' : 'text-text-muted hover:text-text-primary'}`}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Marks Sheet ({activeTest.title.substring(0, 14)}...)
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search tests by title..." value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))} className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select value={filters.grade_id} onChange={(e) => setFilters((prev) => ({ ...prev, grade_id: e.target.value, page: 1 }))} className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
          <option value="">All Classes</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>

        <select value={filters.section} onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value, page: 1 }))} className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
          <option value="All">All Sections</option>
          {sections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
        </select>

        <select value={filters.subject_id} onChange={(e) => setFilters((prev) => ({ ...prev, subject_id: e.target.value, page: 1 }))} className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))} className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Marks_Entered">Marks Entered</option>
          <option value="Published">Published</option>
        </select>

        <button type="button" onClick={onReset} className="p-2 rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary transition-colors ml-auto" title="Reset Filters">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
