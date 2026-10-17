import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';
import axios from '../../api/axios';

const EnterMarksModal = ({ isOpen, onClose, sheetId, onMarksSaved }) => {
  const [sheet, setSheet] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !sheetId) return;
    setLoading(true);
    axios.get(`/api/exam-suite/mark-sheets/${sheetId}`).then(res => {
      const s = res.data.markSheet;
      setSheet(s);
      setEntries(s.marks || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isOpen, sheetId]);

  if (!isOpen) return null;

  const handleMarksChange = (idx, val) => {
    const obt = Math.max(0, Math.min(sheet?.max_marks || 100, Number(val) || 0));
    const max = sheet?.max_marks || 100;
    const pct = Math.round((obt / max) * 100);
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 33 ? 'D' : 'F';
    const color = pct >= 33 ? '#16A34A' : '#DC2626';
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, obtained_marks: obt, percentage: pct, grade, status_color: color } : e));
  };

  const handleAbsentToggle = (idx) => {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, is_absent: !e.is_absent, obtained_marks: !e.is_absent ? 0 : e.obtained_marks } : e));
  };

  const handleSave = async (submitStatus = 'Draft') => {
    try {
      setSaving(true);
      await axios.post(`/api/exam-suite/mark-sheets/${sheetId}/marks`, { marks: entries, status: submitStatus });
      onMarksSaved();
      onClose();
    } catch {} finally {
      setSaving(false);
    }
  };

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
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2.5 font-mono text-slate-500">{en.student_id?.roll_number || idx + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-800 dark:text-white">{en.student_id?.name || `${en.student_id?.first_name || ''} ${en.student_id?.last_name || ''}`}</td>
                    <td className="p-2.5">
                      <input type="number" disabled={en.is_absent} min="0" max={sheet?.max_marks || 100} value={en.obtained_marks ?? 0} onChange={(e) => handleMarksChange(idx, e.target.value)} className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold" />
                    </td>
                    <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{en.percentage}%</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: en.status_color || '#16A34A' }}>
                        {en.grade}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <input type="checkbox" checked={en.is_absent} onChange={() => handleAbsentToggle(idx)} className="rounded text-red-600 focus:ring-0 cursor-pointer" />
                    </td>
                  </tr>
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
