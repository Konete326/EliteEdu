import React, { memo } from 'react';

const ExamMarksRowItem = memo(function ExamMarksRowItem({ row, maxTheory, maxPractical, totalMax, onChange }) {
  const isAbsent = row.status === 'ABSENT';

  const handleMarks = (field, val) => {
    const num = val === '' ? '' : Math.max(0, parseInt(val, 10) || 0);
    const updated = { ...row, [field]: num };
    const t = Number(field === 'theory_obtained' ? num : (row.theory_obtained || 0));
    const p = Number(field === 'practical_obtained' ? num : (row.practical_obtained || 0));
    const total = t + p;
    const pct = totalMax > 0 ? Math.round((total / totalMax) * 100) : 0;
    updated.total_obtained = total;
    updated.percentage = pct;
    updated.grade_letter = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';
    updated.status = pct >= 33 ? 'PASS' : 'FAIL';
    onChange(updated);
  };

  const toggleAbsent = () => {
    if (isAbsent) {
      onChange({ ...row, status: 'PASS', theory_obtained: '', practical_obtained: '', total_obtained: 0, percentage: 0, grade_letter: 'F' });
    } else {
      onChange({ ...row, status: 'ABSENT', theory_obtained: 0, practical_obtained: 0, total_obtained: 0, percentage: 0, grade_letter: 'F' });
    }
  };

  return (
    <tr className={`border-b border-line dark:border-line-dark text-xs ${isAbsent ? 'bg-red-50/50 dark:bg-red-950/20' : 'hover:bg-hover dark:hover:bg-hover-dark/40'}`}>
      <td className="py-2.5 px-3">
        <span className="font-bold text-text-primary dark:text-text-primary-dark">{row.roll_number || '-'}</span>
        <span className="text-[10px] text-text-muted block">GR: {row.gr_number || '-'}</span>
      </td>
      <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-text-primary-dark">
        {row.name}
        <span className="text-[10px] text-text-muted block">{row.father_name || ''}</span>
      </td>
      <td className="py-2.5 px-3">
        <input type="number" min="0" max={maxTheory} disabled={isAbsent} value={row.theory_obtained} onChange={(e) => handleMarks('theory_obtained', e.target.value)} placeholder={`Max ${maxTheory}`} className="w-16 px-2 py-1 text-xs font-semibold rounded border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark disabled:opacity-40" />
      </td>
      <td className="py-2.5 px-3">
        <input type="number" min="0" max={maxPractical} disabled={isAbsent} value={row.practical_obtained} onChange={(e) => handleMarks('practical_obtained', e.target.value)} placeholder={`Max ${maxPractical}`} className="w-16 px-2 py-1 text-xs font-semibold rounded border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark disabled:opacity-40" />
      </td>
      <td className="py-2.5 px-3 font-bold text-text-primary dark:text-text-primary-dark">
        {isAbsent ? '0' : row.total_obtained} / {totalMax}
      </td>
      <td className="py-2.5 px-3 font-bold text-primary">
        {isAbsent ? '0%' : `${row.percentage}%`}
      </td>
      <td className="py-2.5 px-3">
        <span className={`px-1.5 py-0.5 rounded font-black text-[10px] ${row.grade_letter === 'F' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
          {row.grade_letter}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <button type="button" onClick={toggleAbsent} className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isAbsent ? 'bg-red-600 text-white' : 'border border-line dark:border-line-dark text-text-muted hover:text-red-500'}`}>
          {isAbsent ? 'ABSENT' : 'Mark Absent'}
        </button>
      </td>
      <td className="py-2.5 px-3">
        <input type="text" value={row.remarks || ''} onChange={(e) => onChange({ ...row, remarks: e.target.value })} placeholder="Remarks" className="w-24 px-2 py-1 text-xs rounded border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
      </td>
    </tr>
  );
});

export default ExamMarksRowItem;
