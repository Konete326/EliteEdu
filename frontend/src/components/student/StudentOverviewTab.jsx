import { Calendar, Clock, BookOpen } from 'lucide-react';
import TimetableMatrixGrid from '../admin/timetable/TimetableMatrixGrid';

const StudentOverviewTab = ({ timetable = [] }) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Homework &amp; Assignments
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Coming Soon
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 text-center space-y-1">
            <p className="font-bold text-xs text-ink dark:text-ink-dark">LMS &amp; Homework Studio Underway</p>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Paperless homework submission, teacher feedback, and subject quizzes will be available in the upcoming release.
            </p>
          </div>
        </div>

        <div className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Live Virtual Classrooms
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Coming Soon
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 text-center space-y-1">
            <p className="font-bold text-xs text-ink dark:text-ink-dark">Virtual Classroom Studio Coming Soon</p>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Interactive video classrooms, whiteboard lectures, and live sessions will be available here shortly.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Class Weekly Timetable Routine
        </h4>
        <div className="overflow-x-auto">
          <TimetableMatrixGrid slots={timetable} viewMode="class" canManage={false} />
        </div>
      </div>
    </div>
  );
};

export default StudentOverviewTab;
