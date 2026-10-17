import React, { useState } from 'react';
import { Plus, Sparkles, BookOpen, Edit2, Trash2 } from 'lucide-react';
import ChapterModal from './ChapterModal';

const ChaptersTab = ({ chapters, grades, subjects, selectedGrade, selectedSubject, onGradeChange, onSubjectChange, onSaveChapter, onDeleteChapter, onSeedChapters }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <select value={selectedGrade} onChange={(e) => onGradeChange(e.target.value)} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">All Classes</option>
            {grades.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <select value={selectedSubject} onChange={(e) => onSubjectChange(e.target.value)} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {selectedGrade && selectedSubject && (
            <button onClick={onSeedChapters} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50">
              <Sparkles size={14} /> Seed Standard Chapters
            </button>
          )}
          <button onClick={() => { setSelectedChapter(null); setModalOpen(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
            <Plus size={15} /> Add Chapter
          </button>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No chapters found</h4>
          <p className="text-xs text-slate-400">Select a Class and Subject to view or seed chapters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Chapter #</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {chapters.map(ch => (
                <tr key={ch._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">Ch. {ch.chapter_no}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{ch.title}</td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-sm truncate">{ch.description || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">{ch.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedChapter(ch); setModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-primary"><Edit2 size={14} /></button>
                      <button onClick={() => onDeleteChapter(ch._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ChapterModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedChapter(null); }} onSave={onSaveChapter} chapter={selectedChapter} gradeId={selectedGrade} subjectId={selectedSubject} />
    </div>
  );
};

export default ChaptersTab;
