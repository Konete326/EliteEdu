import React, { useCallback } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Award, Printer, Save, FileSpreadsheet } from 'lucide-react';
import ClassTestMarksRowItem from './ClassTestMarksRowItem';

export default function ClassTestMarksSheet({ test, rows = [], setRows, onSave, isSaving, onBack, onPrint }) {
  const totalMax = test?.total_marks || 25;
  const passingMarks = test?.passing_marks ?? Math.round(totalMax * 0.33);

  const handleRowChange = useCallback((idx, updated) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });
  }, [setRows]);

  const setAllMaxMarks = () => {
    setRows((prev) => prev.map((r) => {
      if (r.is_absent) return r;
      return { ...r, obtained_marks: totalMax, percentage: 100, grade_letter: 'A+', pass_status: 'PASS' };
    }));
  };

  const resetAllMarks = () => {
    setRows((prev) => prev.map((r) => ({ ...r, obtained_marks: '', is_absent: false, percentage: 0, grade_letter: 'F', pass_status: 'FAIL' })));
  };

  const appearedCount = rows.filter((r) => !r.is_absent).length;
  const passedCount = rows.filter((r) => !r.is_absent && Number(r.obtained_marks) >= passingMarks).length;
  const absentCount = rows.filter((r) => r.is_absent).length;
  const avgPct = appearedCount > 0 ? Math.round(rows.reduce((acc, r) => acc + (r.is_absent ? 0 : (r.percentage || 0)), 0) / appearedCount) : 0;

  return (
    <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={onBack} className="p-1.5 rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">{test.title} — Marks Sheet</h3>
            <p className="text-[11px] text-text-muted">{test.grade_id?.name || 'Class'} ({test.section}) • {test.subject_id?.name || 'Subject'} • Total: {totalMax} (Pass: {passingMarks})</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={setAllMaxMarks} className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark">
            Set Max
          </button>
          <button type="button" onClick={resetAllMarks} className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-line dark:border-line-dark hover:bg-red-50 text-text-muted hover:text-red-500">
            Reset
          </button>
          <button type="button" onClick={onPrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button type="button" disabled={isSaving || rows.length === 0} onClick={onSave} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow-2xs">
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Marks'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
        <span className="text-text-muted">Appeared: {appearedCount}/{rows.length}</span>
        <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Passed: {passedCount}</span>
        <span className="text-red-600 bg-red-500/10 px-2 py-0.5 rounded">Failed: {appearedCount - passedCount}</span>
        <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">Absent: {absentCount}</span>
        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded ml-auto">Class Avg: {avgPct}%</span>
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase sticky top-0 bg-surface dark:bg-surface-dark z-10">
            <tr>
              <th className="py-2.5 px-3">Roll / GR</th>
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Obtained (Max {totalMax})</th>
              <th className="py-2.5 px-3">%</th>
              <th className="py-2.5 px-3">Grade</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3">Result</th>
              <th className="py-2.5 px-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <ClassTestMarksRowItem key={row.student_id} row={row} totalMax={totalMax} passingMarks={passingMarks} onChange={(upd) => handleRowChange(idx, upd)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
