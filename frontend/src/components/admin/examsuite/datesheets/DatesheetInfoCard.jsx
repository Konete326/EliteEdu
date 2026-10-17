import React from 'react';

const DatesheetInfoCard = ({ form, onChange, grades, categories }) => {
  const selectedGrade = grades.find(g => g._id === form.grade_id);
  const sections = selectedGrade?.sections || ['A', 'B', 'C'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Datesheet Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Academic Session *</label>
          <input
            type="text"
            value={form.academic_session || '2026-2027'}
            onChange={(e) => onChange('academic_session', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Status *</label>
          <select
            value={form.status || 'Draft'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Class *</label>
          <select
            value={form.grade_id || ''}
            onChange={(e) => onChange('grade_id', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          >
            <option value="">Select class</option>
            {grades.map(g => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Section</label>
          <select
            value={form.section || ''}
            disabled={!form.grade_id}
            onChange={(e) => onChange('section', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white disabled:opacity-50"
          >
            <option value="">{form.grade_id ? 'All Sections' : 'Select a class first'}</option>
            {sections.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Exam Type *</label>
          <select
            value={form.exam_category_id || ''}
            onChange={(e) => onChange('exam_category_id', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          >
            <option value="">Select exam type</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Exam Start Date *</label>
          <input
            type="date"
            value={form.start_date || ''}
            onChange={(e) => onChange('start_date', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Exam End Date *</label>
          <input
            type="date"
            value={form.end_date || ''}
            onChange={(e) => onChange('end_date', e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Instructions</label>
        <textarea
          rows={2}
          value={form.instructions || ''}
          onChange={(e) => onChange('instructions', e.target.value)}
          placeholder="e.g. Students must report 30 minutes before the paper and bring their admit card."
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
        />
      </div>
    </div>
  );
};

export default DatesheetInfoCard;
