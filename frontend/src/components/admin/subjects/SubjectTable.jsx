import { Pencil, Trash2 } from 'lucide-react';
import SubjectToggle from './SubjectToggle';
import { formatClassesLabel } from '../../../utils/curriculumPresets';

const SubjectTable = ({ subjects, onEdit, onDelete, onToggle, toggleLoadingId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider border-b border-line dark:border-white/10">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Classes</th>
            <th className="px-6 py-4 text-center w-36">Status</th>
            <th className="px-6 py-4 text-center w-36">Mandatory</th>
            <th className="px-6 py-4 text-right w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
          {subjects.map((subject) => {
            const isToggling = toggleLoadingId === subject._id;
            const classesLabel = formatClassesLabel(subject.classes);
            return (
              <tr
                key={subject._id}
                className="hover:bg-surface-secondary/40 dark:hover:bg-[#151515] transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-ink dark:text-ink-dark">
                  {subject.name}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark border border-primary/20">
                    {subject.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-surface-secondary dark:bg-[#1a1a1a] text-ink-sub dark:text-ink-muted-dark border border-line dark:border-white/10">
                    {classesLabel}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center justify-center">
                    <SubjectToggle
                      checked={subject.status === 'Active'}
                      onChange={() => onToggle(subject._id, 'status')}
                      disabled={isToggling}
                      ariaLabel={`Toggle status for ${subject.name}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center justify-center">
                    <SubjectToggle
                      checked={subject.mandatory}
                      onChange={() => onToggle(subject._id, 'mandatory')}
                      disabled={isToggling}
                      ariaLabel={`Toggle mandatory for ${subject.name}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(subject)}
                      title="Edit Subject"
                      className="p-1.5 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(subject)}
                      title="Delete Subject"
                      className="p-1.5 rounded-lg text-bad/80 hover:text-bad hover:bg-bad-soft dark:hover:bg-bad/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
