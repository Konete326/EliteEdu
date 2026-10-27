import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Coffee, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import api from '../../../services/api';

const TeacherLiveScheduleWidget = () => {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/timetable/my-schedule')
      .then((res) => { if (mounted && res.data?.success) setScheduleData(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bg-surface dark:bg-surface-dark p-5 rounded-3xl border border-line dark:border-line-dark shadow-xs animate-pulse space-y-3">
        <div className="h-4 w-32 bg-surface-secondary dark:bg-surface-secondary-dark rounded" />
        <div className="h-14 bg-surface-secondary dark:bg-surface-secondary-dark rounded-2xl" />
      </div>
    );
  }

  const { currentSlot, nextSlot, day_of_week } = scheduleData || {};
  const currentData = currentSlot?.slot_data;
  const nextData = nextSlot?.slot_data;

  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-3xl border border-line dark:border-line-dark shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" /> Today's Routine ({day_of_week || 'Today'})
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      <div className="p-3.5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-1.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" /> Now Running
        </div>
        {currentSlot ? (
          <div>
            {currentSlot.is_break ? (
              <div className="font-bold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Coffee className="w-4 h-4" /> Recess / Break ({currentSlot.start_time} – {currentSlot.end_time})
              </div>
            ) : currentSlot.is_free ? (
              <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Free Period (Prep / Faculty Room)
              </div>
            ) : (
              <div>
                <div className="font-bold text-sm text-ink dark:text-ink-dark">
                  {currentSlot.label}: {currentData?.grade_id?.name} ({currentData?.section || 'A'})
                </div>
                <div className="text-xs text-ink-sub dark:text-ink-sub-dark">
                  {currentData?.subject_id?.name} • {currentData?.room_no} ({currentSlot.start_time} – {currentSlot.end_time})
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">No active period in session right now</div>
        )}
      </div>

      {nextSlot && (
        <div className="text-xs text-ink-sub dark:text-ink-sub-dark flex items-center justify-between px-1">
          <span className="font-semibold text-ink-muted dark:text-ink-muted-dark">Up Next:</span>
          <span className="font-bold text-ink dark:text-ink-dark truncate max-w-[180px]">
            {nextSlot.is_break ? 'Recess' : nextSlot.is_free ? 'Free Period' : `${nextSlot.label} - ${nextData?.grade_id?.name || 'Class'}`}
          </span>
          <span className="font-mono text-[10px] text-primary font-bold">{nextSlot.start_time}</span>
        </div>
      )}

      <Link
        to="/teacher/timetable"
        className="w-full py-2 bg-surface-secondary hover:bg-primary/10 dark:bg-surface-secondary-dark dark:hover:bg-primary/20 text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border border-line dark:border-line-dark"
      >
        View Full Weekly Schedule <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default TeacherLiveScheduleWidget;
