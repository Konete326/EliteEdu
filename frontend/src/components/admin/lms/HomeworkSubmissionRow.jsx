const HomeworkSubmissionRow = ({ student, submission = {}, maxMarks = 100, onStatusChange }) => {
  const studentId = student._id || student.student_id;
  const fullName = student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';
  const rollNumber = student.gr_number || student.roll_no || student.admission_no || '-';

  return (
    <tr className="hover:bg-surface-secondary/40 dark:hover:bg-surface-secondary-dark/40 transition-colors">
      <td className="p-3 font-mono font-bold text-xs text-ink-muted">{rollNumber}</td>
      <td className="p-3 min-w-[140px]">
        <div className="font-bold text-xs text-ink dark:text-white truncate">{fullName}</div>
        {student.father_name && (
          <div className="text-[10px] text-ink-muted truncate">S/O {student.father_name}</div>
        )}
      </td>
      <td className="p-3">
        <select
          value={submission.status || 'Pending'}
          onChange={(e) => onStatusChange(studentId, 'status', e.target.value)}
          className="px-2.5 py-1 rounded-xl border border-line dark:border-line-dark text-xs font-semibold bg-surface dark:bg-surface-dark text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
        >
          <option value="Pending">Pending</option>
          <option value="Submitted">Submitted</option>
          <option value="Graded">Graded</option>
          <option value="Late">Late</option>
        </select>
      </td>
      <td className="p-3">
        <input
          type="number"
          max={maxMarks}
          min={0}
          value={submission.obtained_marks !== undefined && submission.obtained_marks !== null ? submission.obtained_marks : ''}
          onChange={(e) => onStatusChange(studentId, 'obtained_marks', e.target.value === '' ? null : Number(e.target.value))}
          className="w-20 px-2.5 py-1 rounded-xl border border-line dark:border-line-dark text-xs font-mono font-bold bg-surface dark:bg-surface-dark text-ink dark:text-white outline-none focus:border-primary"
          placeholder={`0-${maxMarks}`}
        />
      </td>
      <td className="p-3 min-w-[160px]">
        <input
          type="text"
          value={submission.remarks || ''}
          placeholder="Optional remarks..."
          onChange={(e) => onStatusChange(studentId, 'remarks', e.target.value)}
          className="w-full px-2.5 py-1 rounded-xl border border-line dark:border-line-dark text-xs bg-surface dark:bg-surface-dark text-ink dark:text-white outline-none focus:border-primary"
        />
      </td>
    </tr>
  );
};

export default HomeworkSubmissionRow;
