import React, { memo } from 'react';
import { User } from 'lucide-react';

const ClassTestMarksRowItem = memo(function ClassTestMarksRowItem({ row, totalMax, passingMarks, onChange }) {
  const isAbsent = Boolean(row.is_absent);

  const handleMarksChange = (val) => {
    const raw = val === '' ? '' : Math.max(0, Math.min(totalMax, parseInt(val, 10) || 0));
    const obtained = Number(raw) || 0;
    const pct = totalMax > 0 ? Math.round((obtained / totalMax) * 100) : 0;
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';
    const status = obtained >= passingMarks ? 'PASS' : 'FAIL';
    onChange({ ...row, obtained_marks: raw, percentage: pct, grade_letter: grade, pass_status: status });
  };

  const toggleAbsent = () => {
    if (isAbsent) {
      onChange({ ...row, is_absent: false, obtained_marks: 0, percentage: 0, grade_letter: 'F', pass_status: 'FAIL' });
    } else {
      onChange({ ...row, is_absent: true, obtained_marks: 0, percentage: 0, grade_letter: 'F', pass_status: 'ABSENT' });
    }
  };

  return (
    <tr className={`border-b border-line dark:border-line-dark text-xs ${isAbsent ? 'bg-red-50/50 dark:bg-red-950/20' : 'hover:bg-hover dark:hover:bg-hover-dark/40'}`}>
      <td className="py-2.5 px-3">
        <span className="font-bold text-text-primary dark:text-text-primary-dark">{row.roll_number || '-'}</span>
        <span className="text-[10px] text-text-muted block">GR: {row.gr_number || '-'}</span>
      </td>
      <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-text-primary-dark">
        <div className="flex items-center gap-2">
          {row.photo_url ? (
            <img src={row.photo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center text-text-muted shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <div>
            <div className="font-bold leading-tight">{row.name}</div>
            <div className="text-[10px] text-text-muted">{row.father_name || ''}</div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <input type="number" min="0" max={totalMax} disabled={isAbsent} value={row.obtained_marks} onChange={(e) => handleMarksChange(e.target.value)} placeholder={`Max ${totalMax}`} className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark disabled:opacity-30" />
      </td>
      <td className="py-2.5 px-3 font-bold text-primary">
        {isAbsent ? '0%' : `${row.percentage}%`}
      </td>
      <td className="py-2.5 px-3">
        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${row.grade_letter === 'F' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
          {row.grade_letter}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <button type="button" onClick={toggleAbsent} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${isAbsent ? 'bg-red-600 text-white shadow-2xs' : 'border border-line dark:border-line-dark text-text-muted hover:text-red-500'}`}>
          {isAbsent ? 'ABSENT' : 'Mark Absent'}
        </button>
      </td>
      <td className="py-2.5 px-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.pass_status === 'PASS' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {row.pass_status}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <input type="text" value={row.remarks || ''} onChange={(e) => onChange({ ...row, remarks: e.target.value })} placeholder="Remarks" className="w-28 px-2 py-1 text-xs rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
      </td>
    </tr>
  );
});

export default ClassTestMarksRowItem;
