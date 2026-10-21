import TeacherTableRow from './TeacherTableRow';

const TeacherTable = ({
  teachers,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  onOpenPassword,
  onAssignPeriod
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider border-b border-line dark:border-white/10">
          <tr>
            <th className="px-4 py-3.5">Campus</th>
            <th className="px-4 py-3.5">Faculty Member</th>
            <th className="px-4 py-3.5">Live Activity</th>
            <th className="px-4 py-3.5">Attendance Today</th>
            <th className="px-4 py-3.5">Employee ID & Contact</th>
            <th className="px-4 py-3.5">Subjects</th>
            <th className="px-4 py-3.5 text-center">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
          {teachers.map((teacher) => (
            <TeacherTableRow
              key={teacher._id}
              teacher={teacher}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onOpenPassword={onOpenPassword}
              onAssignPeriod={onAssignPeriod}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;