import React from 'react';
import { Trash2, Clock, Calendar, BookOpen, Award } from 'lucide-react';

export default function WizardPaperRowItem({ index, paper, onChange, onRemove, subjects = [], teachers = [], targetClasses = [] }) {
  const handleNumChange = (field, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = { ...paper, [field]: num };
    if (field === 'theory_marks' || field === 'practical_marks') {
      const t = field === 'theory_marks' ? num : (paper.theory_marks || 0);
      const p = field === 'practical_marks' ? num : (paper.practical_marks || 0);
      updated.total_marks = t + p;
      updated.passing_marks = Math.round((t + p) * 0.33);
    }
    onChange(index, updated);
  };

  return (
    <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
          Paper #{index + 1}
        </span>
        <button type="button" onClick={() => onRemove(index)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block mb-1">Subject</label>
          <select value={paper.subject_id || ''} onChange={(e) => {
            const subj = subjects.find((s) => String(s._id) === e.target.value);
            onChange(index, { ...paper, subject_id: e.target.value, subject_name: subj?.name || '' });
          }} className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block mb-1">Target Class</label>
          <select value={`${paper.grade_id || ''}:::${paper.section || 'A'}`} onChange={(e) => {
            const [gId, sec] = e.target.value.split(':::');
            const target = targetClasses.find((t) => String(t.grade_id) === String(gId));
            onChange(index, { ...paper, grade_id: gId, grade_name: target?.grade_name || '', section: sec || 'A' });
          }} className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value=":::">Select Class & Sec</option>
            {targetClasses.flatMap((t) => (t.sections || ['A']).map((sec) => (
              <option key={`${t.grade_id}-${sec}`} value={`${t.grade_id}:::${sec}`}>{t.grade_name} - Sec {sec}</option>
            )))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block mb-1">Invigilator</label>
          <select value={paper.examiner_id || ''} onChange={(e) => {
            const t = teachers.find((tc) => String(tc._id) === e.target.value);
            onChange(index, { ...paper, examiner_id: e.target.value, examiner_name: t?.name || '' });
          }} className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Teacher</option>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Teacher'})</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Date</label>
          <input type="date" value={paper.exam_date ? paper.exam_date.substring(0, 10) : ''} onChange={(e) => onChange(index, { ...paper, exam_date: e.target.value })} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Start Time</label>
          <input type="time" value={paper.start_time || '09:00'} onChange={(e) => onChange(index, { ...paper, start_time: e.target.value })} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Theory</label>
          <input type="number" min="0" value={paper.theory_marks ?? 75} onChange={(e) => handleNumChange('theory_marks', e.target.value)} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Practical</label>
          <input type="number" min="0" value={paper.practical_marks ?? 25} onChange={(e) => handleNumChange('practical_marks', e.target.value)} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Total</label>
          <input type="number" min="1" value={paper.total_marks ?? 100} onChange={(e) => handleNumChange('total_marks', e.target.value)} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-muted/20 text-text-primary dark:text-text-primary-dark font-bold" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-0.5">Room</label>
          <input type="text" placeholder="e.g. Hall-1" value={paper.room_no || ''} onChange={(e) => onChange(index, { ...paper, room_no: e.target.value })} className="w-full text-xs font-semibold px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>
      </div>
    </div>
  );
}
