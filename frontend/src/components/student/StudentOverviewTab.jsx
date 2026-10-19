import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import TimetableMatrixGrid from '../admin/timetable/TimetableMatrixGrid';

const StudentOverviewTab = ({ timetable = [], lmsItems = [] }) => {
  const pendingHomework = lmsItems.filter((it) => it.item_type === 'Homework').slice(0, 3);
  const liveClasses = lmsItems.filter((it) => it.item_type === 'Live_Class').slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> Pending Homework ({pendingHomework.length})
          </h4>
          {pendingHomework.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No pending assignments! All caught up.</p>
          ) : (
            <div className="space-y-2">
              {pendingHomework.map((hw) => (
                <div key={hw._id} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{hw.title}</span>
                    <span className="text-gray-400 block text-[11px]">{hw.subject_id?.name}</span>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                    Due: {new Date(hw.due_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" /> Upcoming Live Sessions
          </h4>
          {liveClasses.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No live classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {liveClasses.map((lc) => (
                <div key={lc._id} className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-rose-900 dark:text-rose-200">{lc.title}</span>
                    <span className="text-gray-400 block text-[11px]">{lc.subject_id?.name} • {lc.start_time}</span>
                  </div>
                  <a
                    href={lc.resource_url || `https://meet.jit.si/${lc.meeting_room_code || 'EliteEdu'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
                  >
                    Join
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" /> My Class Weekly Timetable
        </h4>
        <TimetableMatrixGrid slots={timetable} viewMode="class" canManage={false} />
      </div>
    </div>
  );
};

export default StudentOverviewTab;
