import { Coffee, Bell, BookOpen, MapPin, CheckCircle } from 'lucide-react';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherDayTimeline = ({ selectedDay, onSelectDay, timeline = [], todayDay }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      {WEEKDAYS.map((d) => {
        const isSelected = selectedDay === d;
        const isToday = todayDay === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelectDay(d)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all relative ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {d}
            {isToday && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              }`}>
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>

    <div className="space-y-3">
      {timeline.map((slot) => {
        const isNow = slot.is_current;
        const isBreak = slot.is_break;
        const isAssembly = slot.is_assembly;
        const isFree = slot.is_free;
        const data = slot.slot_data;

        return (
          <div
            key={slot.slot_no}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isNow
                ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-400 shadow-md ring-2 ring-blue-500/30'
                : isBreak
                ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40'
                : isAssembly
                ? 'bg-purple-50/40 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/40'
                : isFree
                ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60 opacity-80'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                isBreak
                  ? 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300'
                  : isAssembly
                  ? 'bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300'
                  : isFree
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
              }`}>
                {isBreak ? <Coffee className="w-5 h-5" /> : isAssembly ? <Bell className="w-5 h-5" /> : `P${slot.period_no}`}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{slot.label}</h4>
                  {isNow && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white animate-pulse">
                      NOW RUNNING
                    </span>
                  )}
                  {isBreak && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">RECESS</span>}
                  {isAssembly && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">ASSEMBLY</span>}
                  {isFree && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">FREE PERIOD</span>}
                </div>
                {!isBreak && !isAssembly && !isFree && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {data?.grade_id?.name} ({data?.section || 'A'}) — {data?.subject_id?.name}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data?.room_no}</span>
                  </div>
                )}
                {isFree && <p className="text-xs text-gray-400 mt-0.5">Staff Room / Lesson Plan Preparation / Student Consultations</p>}
              </div>
            </div>
            <div className="text-right sm:border-l sm:pl-4 border-gray-100 dark:border-gray-700 shrink-0">
              <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{slot.start_time} - {slot.end_time}</div>
              <div className="text-[10px] text-gray-400">{isNow ? 'Currently in progress' : 'Scheduled time'}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default TeacherDayTimeline;
