import TeacherTableRow from './TeacherTableRow';

const TeacherTable = ({ teachers, onToggleStatus, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider border-b border-line dark:border-white/10">
          <tr>
            <th className="px-5 py-3.5">Campus</th>
            <th className="px-5 py-3.5">Name</th>
            <th className="px-5 py-3.5">Employee Code / Device ID</th>
            <th className="px-5 py-3.5">Contact</th>
            <th className="px-5 py-3.5">Subjects</th>
            <th className="px-5 py-3.5">Grades</th>
            <th className="px-5 py-3.5 text-center">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
