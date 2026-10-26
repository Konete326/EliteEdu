import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import axios from '../../api/axios';

const EnterMarksRowItem = memo(({ entry, index, maxMarks, onMarksChange, onAbsentToggle }) => {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
      <td className="p-2.5 font-mono text-slate-500">{entry.student_id?.roll_number || index + 1}</td>
      <td className="p-2.5 font-semibold text-slate-800 dark:text-white">
        {entry.student_id?.name || `${entry.student_id?.first_name || ''} ${entry.student_id?.last_name || ''}`}
      </td>
      <td className="p-2.5">
        <input
          type="number"
          disabled={entry.is_absent}
          min="0"
          max={maxMarks}
          value={entry.obtained_marks ?? 0}
          onChange={(e) => onMarksChange(index, e.target.value)}
          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
        />
      </td>
      <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{entry.percentage}%</td>
      <td className="p-2.5">
        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
          style={{ backgroundColor: entry.status_color || '#16A34A' }}
        >
          {entry.grade}
        </span>
      </td>
      <td className="p-2.5 text-center">
        <input
          type="checkbox"
          checked={entry.is_absent}
          onChange={() => onAbsentToggle(index)}
          className="rounded text-red-600 focus:ring-0 cursor-pointer"
        />
      </td>
    </tr>
  );
});

const EnterMarksModal = ({ isOpen, onClose, sheetId, onMarksSaved }) => {
  const [sheet, setSheet] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !sheetId) return;
    setLoading(true);
    axios.get(`/exam-suite/mark-sheets/${sheetId}`).then(res => {
      const s = res.data.markSheet;
      setSheet(s);
      setEntries(s.marks || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isOpen, sheetId]);

  const handleMarksChange = useCallback((idx, val) => {
    const max = sheet?.max_marks || 100;
    const obt = Math.max(0, Math.min(max, Number(val) || 0));
    const pct = Math.round((obt / max) * 100);
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 33 ? 'D' : 'F';
    const color = pct >= 33 ? '#16A34A' : '#DC2626';
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, obtained_marks: obt, percentage: pct, grade, status_color: color } : e));
  }, [sheet?.max_marks]);

  const handleAbsentToggle = useCallback((idx) => {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, is_absent: !e.is_absent, obtained_marks: !e.is_absent ? 0 : e.obtained_marks } : e));
  }, []);

  const handleSave = async (submitStatus = 'Draft') => {
    try {
      setSaving(true);
      await axios.post(`/exam-suite/mark-sheets/${sheetId}/marks`, { marks: entries, status: submitStatus });
      onMarksSaved();
      onClose();
    } catch {} finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Marks Entry Sheet: {sheet?.subject_id?.name} ({sheet?.grade_id?.name})</h3>
            <p className="text-xs text-slate-400">Total Marks: {sheet?.max_marks} | Passing: {sheet?.passing_marks}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading student roster...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-2.5">Roll No</th>
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Obtained</th>
                  <th className="p-2.5">%</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5 text-center">Absent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {entries.map((en, idx) => (
                  <EnterMarksRowItem
                    key={en.student_id?._id || idx}
                    entry={en}
                    index={idx}
                    maxMarks={sheet?.max_marks || 100}
                    onMarksChange={handleMarksChange}
                    onAbsentToggle={handleAbsentToggle}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => handleSave('Draft')} disabled={saving} className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">Save as Draft</button>
          <button onClick={() => handleSave('Submitted')} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
            <CheckCircle2 size={15} /> {saving ? 'Submitting...' : 'Submit & Finalize'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterMarksModal;
