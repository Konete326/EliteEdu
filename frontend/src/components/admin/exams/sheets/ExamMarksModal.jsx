import React, { useState, useEffect } from 'react';
import { X, Save, FileSpreadsheet } from 'lucide-react';
import axios from '../../../../utils/axiosConfig';
import { useNotification } from '../../../../context/NotificationContext';
import ExamMarksRowItem from './ExamMarksRowItem';

export default function ExamMarksModal({ isOpen, onClose, exam, initialPaper, onSaved }) {
  if (!isOpen || !exam) return null;
  const { showNotification } = useNotification();
  const papers = exam.papers || [];
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(0);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const activePaper = papers[selectedPaperIdx] || papers[0];

  useEffect(() => {
    if (initialPaper) {
      const idx = papers.findIndex((p) => String(p.grade_id) === String(initialPaper.grade_id) && String(p.subject_id) === String(initialPaper.subject_id) && p.section === initialPaper.section);
      if (idx !== -1) setSelectedPaperIdx(idx);
    }
  }, [initialPaper, exam]);

  useEffect(() => {
    if (!activePaper) return;
    setIsLoading(true);
    axios.get(`/api/exams/${exam._id}/marks-sheet?grade_id=${activePaper.grade_id}&section=${activePaper.section || 'A'}&subject_id=${activePaper.subject_id}`)
      .then((res) => setRows(res.data?.rows || []))
      .catch(() => showNotification('Failed to load marks sheet', 'error'))
      .finally(() => setIsLoading(false));
  }, [selectedPaperIdx, exam._id]);

  const handleRowChange = (idx, updated) => {
    setRows((prev) => { const copy = [...prev]; copy[idx] = updated; return copy; });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axios.post(`/api/exams/${exam._id}/marks-sheet`, { grade_id: activePaper.grade_id, section: activePaper.section || 'A', subject_id: activePaper.subject_id, records: rows });
      showNotification('Marks sheet saved and percentages updated!', 'success');
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save marks', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const totalMax = activePaper?.total_marks ?? 100;
  const passCount = rows.filter((r) => r.status === 'PASS').length;
  const failCount = rows.filter((r) => r.status === 'FAIL').length;
  const absentCount = rows.filter((r) => r.status === 'ABSENT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary"><FileSpreadsheet className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Marks Entry & Evaluation Sheet</h3>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">{exam.title} ({exam.term_type})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3 border-b border-line dark:border-line-dark flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted">Paper:</span>
            <select value={selectedPaperIdx} onChange={(e) => setSelectedPaperIdx(Number(e.target.value))} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
              {papers.map((p, idx) => <option key={idx} value={idx}>{p.subject_name} • {p.grade_name || 'Class'} (Sec {p.section})</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Pass: {passCount}</span>
            <span className="text-red-600 bg-red-500/10 px-2 py-0.5 rounded">Fail: {failCount}</span>
            <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">Absent: {absentCount}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? <div className="p-12 text-center text-xs text-text-muted">Loading student records...</div> : rows.length === 0 ? <div className="p-12 text-center text-xs text-text-muted">No students found.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
                  <tr>
                    <th className="py-2 px-3">Roll/GR</th><th className="py-2 px-3">Student</th><th className="py-2 px-3">Theory ({activePaper?.theory_marks ?? 75})</th><th className="py-2 px-3">Practical ({activePaper?.practical_marks ?? 25})</th><th className="py-2 px-3">Total ({totalMax})</th><th className="py-2 px-3">%</th><th className="py-2 px-3">Grade</th><th className="py-2 px-3">Status</th><th className="py-2 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => <ExamMarksRowItem key={row.student_id} row={row} maxTheory={activePaper?.theory_marks ?? 75} maxPractical={activePaper?.practical_marks ?? 25} totalMax={totalMax} onChange={(upd) => handleRowChange(idx, upd)} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-line dark:border-line-dark flex items-center justify-between bg-muted/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark text-text-muted hover:text-text-primary">Cancel</button>
          <button type="button" disabled={isSaving || rows.length === 0} onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow-xs">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Marks & Sync'}
          </button>
        </div>
      </div>
    </div>
  );
}
