import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const NewMarkSheetModal = ({ isOpen, onClose, onSave, grades, subjects, categories, questionPapers }) => {
  const [gradeId, setGradeId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(33);
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [paperId, setPaperId] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gradeId || !subjectId) return;
    setSaving(true);
    await onSave({
      grade_id: gradeId, subject_id: subjectId, exam_category_id: categoryId || null,
      max_marks: Number(maxMarks) || 100, passing_marks: Number(passingMarks) || 33,
      exam_date: examDate, question_paper_id: paperId || null
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">Create New Mark Sheet</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Class *</label>
              <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} required className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="">Select class</option>
                {(grades || []).map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Subject *</label>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="">Select subject</option>
                {(subjects || []).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Exam Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="">Select category</option>
                {(categories || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Exam Date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Max Marks</label>
              <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Passing Marks</label>
              <input type="number" value={passingMarks} onChange={(e) => setPassingMarks(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Optional Question Paper Attachment</label>
            <select value={paperId} onChange={(e) => setPaperId(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <option value="">No paper attached (offline manual entry)</option>
              {(questionPapers || []).map(qp => <option key={qp._id} value={qp._id}>{qp.title} ({qp.total_marks} Marks)</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Save size={14} /> {saving ? 'Creating...' : 'Create Mark Sheet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMarkSheetModal;
