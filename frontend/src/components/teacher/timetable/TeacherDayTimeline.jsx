import { Coffee, Bell, BookOpen, MapPin, CheckCircle2, Clock, Calendar, Layers, PlusCircle, Shuffle, RotateCcw, AlertTriangle } from 'lucide-react';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherDayTimeline = ({
  selectedDay,
  onSelectDay,
  timeline = [],
  todayDay,
  onOpenAdjustment,
  onRevertAdjustment
}) => {
  const teachingCount = timeline.filter((s) => !s.is_break && !s.is_assembly && !s.is_free && s.slot_data && !s.is_relieved_busy).length;
  const freeCount = timeline.filter((s) => s.is_free || s.is_relieved_busy).length;
  const breakCount = timeline.filter((s) => s.is_break || s.is_assembly).length;

  const renderCard = (slot) => {
    const isNow = slot.is_current;
    const isBreak = slot.is_break;
    const isAssembly = slot.is_assembly;
    const isFree = slot.is_free;
    const isRelieved = slot.is_relieved_busy;
    const isCovered = slot.is_covered_by_other;
    const isAdjusted = slot.is_relief || slot.is_extra_class || slot.is_double_period;
    const data = slot.slot_data;

    return (
      <div
        key={slot.slot_no}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
          isNow
            ? 'bg-primary/5 dark:bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md'
            : isRelieved || isCovered
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
            : isAdjusted
            ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30 shadow-xs'
            : isBreak
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
            : isAssembly
            ? 'bg-primary/[0.04] dark:bg-primary/[0.08] border-primary/25 shadow-xs hover:border-primary/40'
            : isFree
            ? 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark border-dashed opacity-90'
            : 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md'
        }`}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isNow
                ? 'bg-primary text-white shadow-xs'
                : isRelieved || isCovered
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                : isAdjusted
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : isBreak
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                : isAssembly
                ? 'bg-primary/10 text-primary dark:text-primary-hover'
                : isFree
                ? 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark'
                : 'bg-primary/10 text-primary dark:text-primary-hover'
            }`}>
              {isBreak ? (
                <>
                  <Coffee className="w-3.5 h-3.5" /> Recess
                </>
              ) : isAssembly ? (
                <>
                  <Bell className="w-3.5 h-3.5" /> Assembly
                </>
              ) : isRelieved ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Relieved / Busy
                </>
              ) : isCovered ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Covered by Substitute
                </>
              ) : isAdjusted ? (
                <>
                  <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {slot.is_relief ? 'Proxy Class' : slot.is_double_period ? 'Double Period' : 'Extra Class'}
                  </span>
                </>
              ) : isFree ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Free Period
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" /> Period {slot.period_no || slot.slot_no}
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink-sub dark:text-ink-sub-dark">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{slot.start_time} – {slot.end_time}</span>
            </div>
          </div>

          {isNow && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary text-white shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live In Session
            </div>
          )}

          <div>
            {isBreak ? (
              <div className="space-y-1">
                <h4 className="text-base font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Recess / Refreshment Break
                </h4>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Break time for students & staff members</p>
                <div className="flex items-center gap-1 text-xs text-ink-muted dark:text-ink-muted-dark pt-1">
                  <MapPin className="w-3.5 h-3.5" /> Cafeteria / Courtyard
                </div>
              </div>
            ) : isAssembly ? (
              <div className="space-y-1">
                <h4 className="text-base font-bold text-ink dark:text-ink-dark flex items-center gap-2 group-hover:text-primary transition-colors">
                  <Bell className="w-5 h-5 text-primary" /> Morning Assembly
                </h4>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Institution prayer & general announcements</p>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark pt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Assembly Ground
                </div>
              </div>
            ) : isRelieved ? (
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" /> Relieved from Period
                </h4>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                  {slot.relief_remarks || 'Temporarily relieved from classroom teaching for administrative / school duty.'}
                </p>
                {slot.adjustment_id && (
                  <button
                    type="button"
                    onClick={() => onRevertAdjustment?.(slot.adjustment_id)}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer pt-1"
                  >
                    <RotateCcw size={12} /> Resume Period
                  </button>
                )}
              </div>
            ) : isCovered ? (
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Covered by {slot.covered_by || 'Substitute'}
                </h4>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                  {slot.relief_remarks || 'This period is being taken by another faculty member today.'}
                </p>
              </div>
            ) : isFree ? (
              <div className="space-y-2">
                <div>
                  <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Free Period (Prep Slot)
                  </h4>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Lesson planning, grading & student consultation</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAdjustment?.(slot)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Take Proxy / Extra Class</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-bold text-ink dark:text-ink-dark group-hover:text-primary transition-colors">
                  {data?.grade_id?.name || 'Class'}
                  <span className="ml-2 px-2 py-0.5 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-xs font-bold text-ink-sub">
                    Sec {data?.section || 'A'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary shrink-0" />
                  <span>{data?.subject_id?.name || 'Subject'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark pt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{data?.room_no || 'Room 101'}</span>
                  </div>
                  {slot.adjustment_id && (
                    <button
                      type="button"
                      onClick={() => onRevertAdjustment?.(slot.adjustment_id)}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      <RotateCcw size={11} /> Revert
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line dark:border-line-dark pt-3 mt-4 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark">
            {isNow
              ? 'Active right now'
              : isRelieved
              ? 'Relieved Today'
              : isAdjusted
              ? 'Daily Adjustment'
              : isBreak
              ? 'Break Slot'
              : isAssembly
              ? 'Assembly Slot'
              : isFree
              ? 'Free Slot'
              : 'Scheduled Period'}
          </span>

          <div className="flex items-center gap-2">
            {!isBreak && !isAssembly && !isFree && !isRelieved && !isCovered && (
              <button
                type="button"
                onClick={() => onOpenAdjustment?.(slot)}
                className="text-[10px] font-bold text-ink-muted hover:text-primary transition-colors cursor-pointer"
              >
                Quick Adjust
              </button>
            )}
            <span className="font-mono text-[10px] text-ink-muted dark:text-ink-muted-dark font-semibold">
              Slot #{slot.slot_no}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {WEEKDAYS.map((d) => {
            const isSelected = selectedDay === d;
            const isToday = todayDay === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onSelectDay(d)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark border border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
                }`}
              >
                <span>{d}</span>
                {isToday && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-primary/15 text-primary dark:text-primary-hover'
                  }`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onOpenAdjustment?.(null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>+ Quick Period Adjustment / Proxy</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-3.5 rounded-2xl">
          <div className="text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">Total Slots</div>
          <div className="text-xl font-bold text-ink dark:text-ink-dark mt-0.5">{timeline.length}</div>
        </div>
        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-3.5 rounded-2xl">
          <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Teaching Classes</div>
          <div className="text-xl font-bold text-primary mt-0.5">{teachingCount}</div>
        </div>
        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-3.5 rounded-2xl">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Free Periods</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{freeCount}</div>
        </div>
        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-3.5 rounded-2xl">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Recess / Breaks</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{breakCount}</div>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-ink dark:text-ink-dark">No Scheduled Periods</h4>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
            There are no timetable slots configured for {selectedDay}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeline.map((slot) => renderCard(slot))}
        </div>
      )}
    </div>
  );
};

export default TeacherDayTimeline;
