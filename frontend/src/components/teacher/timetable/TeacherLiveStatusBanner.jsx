import { Clock, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';

const TeacherLiveStatusBanner = ({ currentSlot, nextSlot, bellSchedule }) => {
  const isBreak = currentSlot?.is_break;
  const isFree = currentSlot?.is_free;
  const slotData = currentSlot?.slot_data;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-200">Live Faculty Bell Roster</h2>
        </div>
        <div className="text-xs font-mono text-blue-200/80 bg-white/10 px-3 py-1 rounded-full w-fit">
          Hours: {bellSchedule?.school_start_time || '08:00 AM'} - {bellSchedule?.school_end_time || '02:00 PM'} (Fri: {bellSchedule?.friday_end_time || '12:30 PM'})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Currently Running
          </div>
          {currentSlot ? (
            <div>
              {isBreak ? (
                <div className="space-y-1">
                  <div className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Coffee className="w-5 h-5" /> Recess / Break Time
                  </div>
                  <div className="text-xs font-mono text-amber-200/80">{currentSlot.start_time} - {currentSlot.end_time}</div>
                </div>
              ) : isFree ? (
                <div className="space-y-1">
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Free Period (Staff Room / Prep)
                  </div>
                  <div className="text-xs font-mono text-blue-200">{currentSlot.label} ({currentSlot.start_time} - {currentSlot.end_time})</div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-lg font-black text-white">
                    {currentSlot.label}: {slotData?.grade_id?.name || 'Class'} ({slotData?.section || 'A'})
                  </div>
                  <div className="text-xs text-blue-200 font-semibold">
                    {slotData?.subject_id?.name || 'Subject'} • {slotData?.room_no || 'Room 101'}
                  </div>
                  <div className="text-xs font-mono text-emerald-300">{currentSlot.start_time} - {currentSlot.end_time}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm font-semibold text-blue-200/80 py-1">
              No active period currently running (Outside school hours)
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Up Next
          </div>
          {nextSlot ? (
            <div className="space-y-1">
              <div className="text-base font-bold text-white">
                {nextSlot.is_break ? 'Recess / Break Time' : nextSlot.is_free ? 'Free Period' : `${nextSlot.label}: ${nextSlot.slot_data?.grade_id?.name || 'Class'} (${nextSlot.slot_data?.section || 'A'})`}
              </div>
              {!nextSlot.is_break && !nextSlot.is_free && (
                <div className="text-xs text-blue-200">
                  {nextSlot.slot_data?.subject_id?.name} • {nextSlot.slot_data?.room_no}
                </div>
              )}
              <div className="text-xs font-mono text-blue-300">{nextSlot.start_time} - {nextSlot.end_time}</div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-blue-200/80 py-1">
              All periods completed for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherLiveStatusBanner;
