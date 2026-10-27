import { Loader2, Users } from 'lucide-react';
import TeacherStudentCard from './TeacherStudentCard';

const TeacherStudentCardGrid = ({
  students = [],
  loading = false,
  hasMore = false,
  sentinelRef,
  onEdit,
  onView
}) => {
  if (loading && students.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-4 h-56 animate-pulse flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary" />
                <div className="w-16 h-5 rounded-lg bg-surface-secondary" />
              </div>
              <div className="h-4 w-3/4 rounded-md bg-surface-secondary" />
              <div className="h-3 w-1/2 rounded-md bg-surface-secondary" />
            </div>
            <div className="h-8 rounded-xl bg-surface-secondary" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && students.length === 0) {
    return (
      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center text-ink-muted">
          <Users size={24} />
        </div>
        <p className="font-bold text-sm text-ink dark:text-ink-dark">No students found matching your criteria</p>
        <p className="text-xs text-ink-muted">Try adjusting your search terms or filter settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {students.map((st) => (
          <TeacherStudentCard
            key={st._id}
            student={st}
            onEdit={onEdit}
            onView={onView}
          />
        ))}
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

export default TeacherStudentCardGrid;
