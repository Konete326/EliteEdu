import React from 'react';
import { PlusCircle, Save, RotateCcw, RefreshCw, AlertTriangle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClassTestFormCard({ formData, setFormData, onSave, onReset, isSaving, editingTest, onCancelEdit, prereqs, onRefreshPrereqs, isPrereqLoading }) {
  const grades = prereqs?.grades || [];
  const subjects = prereqs?.subjects || [];
  const teachers = prereqs?.teachers || [];
  const selectedGradeObj = grades.find((g) => String(g._id) === String(formData.grade_id));
  const availableSections = selectedGradeObj?.sections || ['A'];

  const handleTotalChange = (val) => {
    const total = Math.max(1, parseInt(val, 10) || 1);
    setFormData((prev) => ({ ...prev, total_marks: total, passing_marks: Math.round(total * 0.33) }));
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">{editingTest ? 'Edit Class Test' : 'Create Class Test'}</h3>
        </div>
        <button type="button" onClick={onRefreshPrereqs} disabled={isPrereqLoading} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isPrereqLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {(grades.length === 0 || subjects.length === 0) && (
        <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{grades.length === 0 && <Link to="/admin/grades" className="underline font-bold mr-2">+ Add Class</Link>}{subjects.length === 0 && <Link to="/admin/subjects" className="underline font-bold">+ Add Subject</Link>}</div>
        </div>
      )}

      <form onSubmit={onSave} className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted mb-1">Test Title *</label>
          <input type="text" required placeholder="e.g. Chapter 1 Quiz" value={formData.title || ''} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Test Date *</label>
            <input type="date" required value={formData.test_date ? String(formData.test_date).substring(0, 10) : ''} onChange={(e) => setFormData((prev) => ({ ...prev, test_date: e.target.value }))} className="w-full px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Class / Grade *</label>
            <select required value={formData.grade_id || ''} onChange={(e) => setFormData((prev) => ({ ...prev, grade_id: e.target.value, section: 'A' }))} className="w-full px-2 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark">
              <option value="">Select Class</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Section *</label>
            <select value={formData.section || 'A'} onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))} className="w-full px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark">
              {availableSections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Subject *</label>
            <select required value={formData.subject_id || ''} onChange={(e) => setFormData((prev) => ({ ...prev, subject_id: e.target.value }))} className="w-full px-2 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark">
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted mb-1">Assigned Teacher</label>
          <select value={formData.teacher_id || ''} onChange={(e) => setFormData((prev) => ({ ...prev, teacher_id: e.target.value }))} className="w-full px-2.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-semibold text-text-primary dark:text-text-primary-dark">
            <option value="">Select Teacher (Optional)</option>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Teacher'})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Total Marks *</label>
            <input type="number" min="1" required value={formData.total_marks ?? 25} onChange={(e) => handleTotalChange(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-bold text-text-primary dark:text-text-primary-dark" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted mb-1">Passing Marks *</label>
            <input type="number" min="0" required value={formData.passing_marks ?? 8} onChange={(e) => setFormData((prev) => ({ ...prev, passing_marks: parseInt(e.target.value, 10) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark font-bold text-text-primary dark:text-text-primary-dark" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted mb-1">Topic / Syllabus</label>
          <input type="text" placeholder="e.g. Unit 3 Exercises" value={formData.topic || ''} onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
        <div className="pt-2 flex items-center justify-between gap-2">
          {editingTest ? (
            <button type="button" onClick={onCancelEdit} className="px-3 py-2 text-xs font-semibold rounded-xl border border-line dark:border-line-dark text-text-muted">Cancel</button>
          ) : (
            <button type="button" onClick={onReset} className="flex items-center gap-1 text-[11px] font-semibold text-text-muted hover:text-red-500"><RotateCcw className="w-3 h-3" /> Reset</button>
          )}
          <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-2xs">
            {editingTest ? <Save className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving...' : editingTest ? 'Update Test' : 'Create Test'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
