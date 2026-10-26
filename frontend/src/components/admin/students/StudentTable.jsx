import { usePermissions } from '../../../hooks/usePermissions';
import StudentTableRow from './StudentTableRow';

const StudentTable = ({
  students,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  onOpenLedger,
  onOpenAttendance,
  onOpenAdmissionLetter,
  onOpenIdCard
}) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('students');

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider border-b border-line dark:border-white/10">
          <tr>
            <th className="px-5 py-3.5">Campus</th>
            <th className="px-5 py-3.5">Student</th>
            <th className="px-5 py-3.5">GR # / Admission Date</th>
            <th className="px-5 py-3.5">Class</th>
            <th className="px-5 py-3.5">Section</th>
            <th className="px-5 py-3.5">Phone</th>
            <th className="px-5 py-3.5">Monthly Fee</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Fee Ledger</th>
            <th className="px-5 py-3.5">Attendance</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
          {students.map((student) => (
            <StudentTableRow
              key={student._id}
              student={student}
              hasDelete={hasDelete}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onOpenLedger={onOpenLedger}
              onOpenAttendance={onOpenAttendance}
              onOpenAdmissionLetter={onOpenAdmissionLetter}
              onOpenIdCard={onOpenIdCard}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
