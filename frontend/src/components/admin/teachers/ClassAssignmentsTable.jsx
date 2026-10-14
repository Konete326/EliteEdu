import { Trash2 } from 'lucide-react';

const ClassAssignmentsTable = ({ assignments = [], onRemove }) => {
  if (assignments.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm text-center text-ink-muted text-xs">
        No class assignments yet. Select a subject and grade above to create teaching attachments.
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Active Assignments
        </h4>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
          {assignments.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-ink-muted">
              <th className="pb-3 font-semibold">Subject</th>
              <th className="pb-3 font-semibold">Grade / Class</th>
              <th className="pb-3 font-semibold">Section</th>
              <th className="pb-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40 dark:divide-line-dark/40 font-medium">
            {assignments.map((a, i) => (
              <tr key={i} className="hover:bg-surface-secondary/30">
                <td className="py-2.5 font-bold text-ink dark:text-ink-dark">
                  {a.subject_id?.name || a._subject_name || 'Subject'}
                </td>
                <td className="py-2.5 text-ink-muted">
                  {a.grade_id?.name || a._grade_name || 'Grade'}
                </td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                    Sec {a.section}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-bad hover:scale-110 p-1 transition-transform"
                    title="Remove assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassAssignmentsTable;
