const HomeworkSubmissionRow = ({ student, submission = {}, maxMarks = 100, onStatusChange }) => (
  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
    <td className="p-3 font-mono font-medium">{student.roll_no || student.admission_no || '-'}</td>
    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{student.first_name} {student.last_name}</td>
    <td className="p-3">
      <select
        value={submission.status || 'Pending'}
        onChange={(e) => onStatusChange(student._id, 'status', e.target.value)}
        className="px-2 py-1 rounded border text-xs bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
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
        value={submission.obtained_marks !== undefined ? submission.obtained_marks : ''}
        onChange={(e) => onStatusChange(student._id, 'obtained_marks', Number(e.target.value))}
        className="w-20 px-2 py-1 border rounded text-xs bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
      />
    </td>
    <td className="p-3">
      <input
        type="text"
        value={submission.remarks || ''}
        placeholder="Optional remarks"
        onChange={(e) => onStatusChange(student._id, 'remarks', e.target.value)}
        className="w-full px-2 py-1 border rounded text-xs bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
      />
    </td>
  </tr>
);

export default HomeworkSubmissionRow;
