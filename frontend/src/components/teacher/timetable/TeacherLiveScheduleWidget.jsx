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
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse space-y-3">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-14 bg-gray-100 dark:bg-gray-700/50 rounded-2xl" />
      </div>
    );
  }

  const { currentSlot, nextSlot, day_of_week } = scheduleData || {};
  const currentData = currentSlot?.slot_data;
  const nextData = nextSlot?.slot_data;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" /> Today's Routine ({day_of_week || 'Today'})
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
        </span>
      </div>

      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/40 space-y-1.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Now Running
        </div>
        {currentSlot ? (
          <div>
            {currentSlot.is_break ? (
              <div className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Coffee className="w-4 h-4" /> Recess / Break ({currentSlot.start_time} - {currentSlot.end_time})
              </div>
            ) : currentSlot.is_free ? (
              <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Free Period (Prep / Staff Room)
              </div>
            ) : (
              <div>
                <div className="font-bold text-sm text-blue-950 dark:text-blue-100">
                  {currentSlot.label}: {currentData?.grade_id?.name} ({currentData?.section || 'A'})
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {currentData?.subject_id?.name} • {currentData?.room_no} ({currentSlot.start_time} - {currentSlot.end_time})
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500 font-medium">No active period in session right now</div>
        )}
      </div>

      {nextSlot && (
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between px-1">
          <span className="font-semibold text-gray-500">Up Next:</span>
          <span className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
            {nextSlot.is_break ? 'Recess' : nextSlot.is_free ? 'Free Period' : `${nextSlot.label} - ${nextData?.grade_id?.name || 'Class'}`}
          </span>
          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">{nextSlot.start_time}</span>
        </div>
      )}

      <Link
        to="/teacher/timetable"
        className="w-full py-2 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700/50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
      >
        View Full Weekly Schedule <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default TeacherLiveScheduleWidget;
