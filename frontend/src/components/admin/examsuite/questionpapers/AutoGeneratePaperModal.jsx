import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const AutoGeneratePaperModal = ({ isOpen, onClose, onGenerate, grades, subjects, chapters }) => {
  const [title, setTitle] = useState('Mid Term Assessment Paper');
  const [gradeId, setGradeId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [mcqCount, setMcqCount] = useState(10);
  const [shortCount, setShortCount] = useState(5);
  const [longCount, setLongCount] = useState(2);
  const [duration, setDuration] = useState(120);
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gradeId || !subjectId) return;
    setGenerating(true);
    await onGenerate({
      title: title.trim(), grade_id: gradeId, subject_id: subjectId,
      mcq_count: Number(mcqCount), short_count: Number(shortCount),
      long_count: Number(longCount), duration_minutes: Number(duration)
    });
    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Auto-Generate Question Paper
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Paper Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Class *</label>
              <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="">Select class</option>
                {grades.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Subject *</label>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">MCQs</label>
              <input type="number" min="0" value={mcqCount} onChange={(e) => setMcqCount(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-xl border border-slate-200 text-center font-bold" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Short Qs</label>
              <input type="number" min="0" value={shortCount} onChange={(e) => setShortCount(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-xl border border-slate-200 text-center font-bold" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Long Qs</label>
              <input type="number" min="0" value={longCount} onChange={(e) => setLongCount(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-xl border border-slate-200 text-center font-bold" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Time (Mins)</label>
              <input type="number" min="15" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded-xl border border-slate-200 text-center font-bold" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={generating} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Sparkles size={14} /> {generating ? 'Generating Paper...' : 'Generate Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoGeneratePaperModal;
