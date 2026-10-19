const OperationsStudentSelector = ({ studentId, onChange, students }) => (
  <div>
    <label className="block text-[10px] font-bold text-ink-muted mb-1">Associated Student</label>
    <select
      value={studentId}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none"
    >
      <option value="">Select Student (Optional)</option>
      {students.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name} ({s.roll_number || 'N/A'})
        </option>
      ))}
    </select>
  </div>
);

export default OperationsStudentSelector;
