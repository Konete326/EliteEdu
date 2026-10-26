import { Calendar, Clock, BookOpen } from 'lucide-react';
import TimetableMatrixGrid from '../admin/timetable/TimetableMatrixGrid';

const StudentOverviewTab = ({ timetable = [], lmsItems = [] }) => {
  const pendingHomework = lmsItems.filter((it) => it.item_type === 'Homework').slice(0, 3);
  const liveClasses = lmsItems.filter((it) => it.item_type === 'Live_Class').slice(0, 2);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Pending Homework ({pendingHomework.length})
            </h4>
          </div>
          {pendingHomework.length === 0 ? (
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark py-3 text-center">No pending assignments! All caught up.</p>
          ) : (
            <div className="space-y-2">
              {pendingHomework.map((hw) => (
                <div key={hw._id} className="p-2.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line/60 dark:border-line-dark/60 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-ink dark:text-ink-dark block truncate">{hw.title}</span>
                    <span className="text-ink-muted dark:text-ink-muted-dark block text-[11px] truncate">{hw.subject_id?.name || 'Subject'}</span>
                  </div>
                  <span className="text-warn-dark font-semibold text-[11px] shrink-0 bg-warn-soft/50 px-2 py-0.5 rounded-md border border-warn/20">
                    Due: {new Date(hw.due_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-bad dark:text-bad-dark" /> Upcoming Live Sessions
            </h4>
          </div>
          {liveClasses.length === 0 ? (
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark py-3 text-center">No live classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {liveClasses.map((lc) => (
                <div key={lc._id} className="p-2.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line/60 dark:border-line-dark/60 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-ink dark:text-ink-dark block truncate">{lc.title}</span>
                    <span className="text-ink-muted dark:text-ink-muted-dark block text-[11px] truncate">{lc.subject_id?.name} • {lc.start_time}</span>
                  </div>
                  <a
                    href={lc.resource_url || `https://meet.jit.si/${lc.meeting_room_code || 'EliteEdu'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-bad hover:bg-bad/90 text-white rounded-lg text-[11px] font-bold shadow-2xs shrink-0"
                  >
                    Join
                  </a>
                </div>
              ))}
            </div>
          )}
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
