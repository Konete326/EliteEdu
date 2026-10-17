import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ChapterModal = ({ isOpen, onClose, onSave, chapter, gradeId, subjectId }) => {
  const [chapterNo, setChapterNo] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (chapter) {
      setChapterNo(chapter.chapter_no || 1);
      setTitle(chapter.title || '');
      setDescription(chapter.description || '');
      setStatus(chapter.status || 'Active');
    } else {
      setChapterNo(1);
      setTitle('');
      setDescription('');
      setStatus('Active');
    }
  }, [chapter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      chapter_no: Number(chapterNo) || 1, title: title.trim(),
      description: description.trim(), status, grade_id: gradeId, subject_id: subjectId
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">{chapter ? 'Edit Chapter' : 'Add Subject Chapter'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Chapter #</label>
              <input type="number" min="1" value={chapterNo} onChange={(e) => setChapterNo(e.target.value)} required className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Chapter Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Chemical Bonding" className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Description / Key Topics</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Overview of learning objectives" className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Save size={14} /> {saving ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterModal;
