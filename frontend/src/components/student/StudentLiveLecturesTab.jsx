import { Radio, Video, ExternalLink, Calendar, Clock, Sparkles } from 'lucide-react';

const StudentLiveLecturesTab = ({ lmsItems = [] }) => {
  const liveClasses = lmsItems.filter((it) => it.item_type === 'Live_Class');
  const materials = lmsItems.filter((it) => it.item_type === 'Lecture_Material');

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
          <Radio className="w-4 h-4 text-bad animate-pulse" /> Live Virtual Classrooms
        </h4>
        {liveClasses.length === 0 ? (
          <div className="p-6 text-center text-xs text-ink-muted dark:text-ink-muted-dark bg-surface dark:bg-surface-dark rounded-2xl border border-dashed border-line dark:border-line-dark">
            No live classes scheduled currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {liveClasses.map((lc) => (
              <div key={lc._id} className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-bad-soft/60 text-bad dark:text-bad-dark border border-bad/20">
                    {lc.subject_id?.name || 'Subject'}
                  </span>
                  <h5 className="font-bold text-ink dark:text-ink-dark text-sm truncate">{lc.title}</h5>
                  <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark flex items-center gap-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lc.scheduled_date || lc.due_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lc.start_time}</span>
                  </p>
                </div>
                <a
                  href={lc.resource_url || `https://meet.jit.si/${lc.meeting_room_code || 'EliteEdu'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-bad hover:bg-bad/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  <Video className="w-3.5 h-3.5" /> Join Room
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-2">
          <Video className="w-4 h-4 text-good" /> Recorded Lectures & Study Material
        </h4>
        {materials.length === 0 ? (
          <div className="p-6 text-center text-xs text-ink-muted dark:text-ink-muted-dark bg-surface dark:bg-surface-dark rounded-2xl border border-dashed border-line dark:border-line-dark">
            No study material or recorded lectures uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {materials.map((mat) => (
              <div key={mat._id} className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-primary-soft text-primary dark:text-primary-dark border border-primary/20">
                    {mat.subject_id?.name || 'Subject'}
                  </span>
                  {mat.resource_url && (
                    <a
                      href={mat.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      Open Resource <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <h5 className="font-bold text-ink dark:text-ink-dark text-sm">{mat.title}</h5>
                {mat.key_notes && (
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5 bg-surface-secondary dark:bg-surface-secondary-dark p-2.5 rounded-xl border border-line/60 dark:border-line-dark/60">
                    <Sparkles className="w-3.5 h-3.5 text-accent-dark shrink-0" /> {mat.key_notes}
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
