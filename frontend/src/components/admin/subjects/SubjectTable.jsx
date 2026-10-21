import { Pencil, Trash2, UserCheck, Layers, BookOpen } from 'lucide-react';
import SubjectToggle from './SubjectToggle';
import { formatClassesLabel } from '../../../utils/curriculumPresets';

const SubjectTable = ({ subjects = [], onEdit, onDelete, onToggle, toggleLoadingId }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border-b border-line dark:border-line-dark text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <th className="py-3 px-3.5">Subject & Code</th>
            <th className="py-3 px-3.5">Type</th>
            <th className="py-3 px-3.5">Classes</th>
            <th className="py-3 px-3.5">Teacher</th>
            <th className="py-3 px-3.5">Periods & Marks</th>
            <th className="py-3 px-3.5">Campus</th>
            <th className="py-3 px-3.5 text-center">Status</th>
            <th className="py-3 px-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark text-xs">
          {subjects.map((subject) => {
            const isToggling = toggleLoadingId === subject._id;
            const classesLabel = formatClassesLabel(subject.classes);
            const isElective = subject.subject_type === 'Elective' || !subject.mandatory;
            const campusName = subject.campus_id?.name || 'All Campuses';
            const teacherName = subject.assigned_teacher?.name;
            const totalMarks = (subject.theory_marks || 0) + (subject.practical_marks || 0);

            return (
              <tr
                key={subject._id}
                className="hover:bg-surface-secondary/50 dark:hover:bg-white/5 transition-colors group"
              >
                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BookOpen size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-ink dark:text-white truncate block">
                        {subject.name}
                      </span>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary">
                        {subject.code}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <div className="space-y-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isElective
                          ? 'bg-accent/15 text-accent dark:bg-accent/25 border border-accent/20'
                          : 'bg-good/15 text-good dark:bg-good/25 border border-good/20'
                      }`}
                    >
                      {isElective ? 'Elective' : 'Compulsory'}
                    </span>
                    {subject.stream && subject.stream !== 'General' && (
                      <p className="text-[10px] font-semibold text-ink-muted flex items-center gap-1">
                        <Layers size={10} className="text-primary shrink-0" />
                        <span className="truncate">{subject.stream}</span>
                      </p>
                    )}
                    {subject.elective_group && (
                      <p className="text-[9px] text-ink-muted truncate">
                        Slot: {subject.elective_group}
                      </p>
                    )}
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-secondary dark:bg-[#1f1f1f] border border-line dark:border-white/10 text-ink dark:text-white">
                    {classesLabel}
                  </span>
                </td>

                <td className="py-3 px-3.5">
                  {teacherName ? (
                    <div className="flex items-center gap-1.5 text-ink dark:text-white">
                      <UserCheck size={13} className="text-good dark:text-good-dark shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold truncate max-w-[130px]">{teacherName}</p>
                        <p className="text-[10px] text-ink-muted truncate max-w-[130px]">
                          {subject.assigned_teacher?.designation || 'Teacher'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-ink-muted italic">Not assigned</span>
                  )}
                </td>

                <td className="py-3 px-3.5 text-[11px] text-ink dark:text-white">
                  <div>
                    <span className="font-semibold">{subject.periods_per_week || 5} per week</span>
                    <span className="text-ink-muted text-[10px] block">
                      {totalMarks} Marks
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-secondary dark:bg-[#1a1a1a] text-ink dark:text-white border border-line dark:border-white/5 truncate max-w-[120px]">
                    {campusName}
                  </span>
                </td>

                <td className="py-3 px-3.5 text-center">
                  <SubjectToggle
                    active={subject.status === 'Active'}
                    onToggle={() => onToggle(subject._id, 'status')}
                    loading={isToggling}
                  />
                </td>

                <td className="py-3 px-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(subject)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(subject)}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectTable;