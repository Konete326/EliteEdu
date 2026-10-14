import { GripVertical, Eye, Pencil, Trash2 } from 'lucide-react';

const GradesTable = ({ grades = [], onEdit, onView, onDelete, onToggleStatus }) => {
  if (grades.length === 0) {
    return (
      <div className="py-16 text-center text-ink-muted">
        <p className="text-sm font-medium">No grades found.</p>
        <p className="text-xs mt-1">Click &ldquo;+ Add Grade&rdquo; to create your first grade and assign sections.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line dark:border-line-dark text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <th className="py-3.5 px-4">Grade Name</th>
            <th className="py-3.5 px-4">Sections</th>
            <th className="py-3.5 px-4">Class Teacher</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 text-xs">
          {grades.map((grade) => (
            <tr key={grade._id} className="hover:bg-surface-secondary/40 transition-colors group">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-ink-muted/40 cursor-grab shrink-0" />
                  <span className="font-bold text-ink dark:text-ink-dark">{grade.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {grade.sections?.map((sec, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {sec}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-ink dark:text-ink-dark font-medium">
                {grade.class_teacher?.name || '—'}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus(grade)}
                  className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 inline-flex items-center ${grade.status === 'Active' ? 'bg-primary' : 'bg-bad'}`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${grade.status === 'Active' ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView(grade)}
                    className="p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-950/30 text-primary hover:bg-purple-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(grade)}
                    className="p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-950/30 text-primary hover:bg-purple-100"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(grade)}
                    className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 text-bad hover:bg-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;
