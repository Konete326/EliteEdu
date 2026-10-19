import { Radio, Video, ExternalLink, Calendar, Clock, Sparkles } from 'lucide-react';

const StudentLiveLecturesTab = ({ lmsItems = [] }) => {
  const liveClasses = lmsItems.filter((it) => it.item_type === 'Live_Class');
  const materials = lmsItems.filter((it) => it.item_type === 'Lecture_Material');

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> Live Virtual Classrooms
        </h4>
        {liveClasses.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">
            No live classes scheduled currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveClasses.map((lc) => (
              <div key={lc._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-900/30">
                    {lc.subject_id?.name}
                  </span>
                  <h5 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{lc.title}</h5>
                  <p className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lc.scheduled_date || lc.due_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lc.start_time}</span>
                  </p>
                </div>
                <a
                  href={lc.resource_url || `https://meet.jit.si/${lc.meeting_room_code || 'EliteEdu'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" /> Join Room
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-500" /> Recorded Lectures & Study Material
        </h4>
        {materials.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">
            No study material or recorded lectures uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {materials.map((mat) => (
              <div key={mat._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30">
                    {mat.subject_id?.name}
                  </span>
                  {mat.resource_url && (
                    <a
                      href={mat.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      Open Resource <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <h5 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{mat.title}</h5>
                {mat.key_notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> {mat.key_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLiveLecturesTab;
