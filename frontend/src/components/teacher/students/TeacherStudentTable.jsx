import { Loader2 } from 'lucide-react';
import TeacherStudentRow from './TeacherStudentRow';

const TeacherStudentTable = ({ loading, students = [], onEdit, onView, hasMore = false, sentinelRef }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/50 text-ink-muted font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3">Student</th>
                <th className="p-3">GR #</th>
                <th className="p-3">Grade / Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark text-ink dark:text-ink-dark">
              {loading && students.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-ink-muted font-medium">Loading assigned roster...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-ink-muted font-medium">No students found matching your criteria.</td></tr>
              ) : (
                students.map((st) => (
                  <TeacherStudentRow
                    key={st._id}
                    student={st}
                    onEdit={onEdit}
                    onView={onView}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="py-6 flex items-center justify-center gap-2 text-ink-muted text-xs font-semibold"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Loading more students...</span>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentTable;
