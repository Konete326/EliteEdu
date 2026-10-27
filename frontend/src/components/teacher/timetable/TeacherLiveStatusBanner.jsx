import { Clock, Coffee, Sparkles, CheckCircle2, MapPin, BookOpen, Layers } from 'lucide-react';

const TeacherLiveStatusBanner = ({ currentSlot, nextSlot, bellSchedule }) => {
  const isBreak = currentSlot?.is_break;
  const isFree = currentSlot?.is_free;
  const slotData = currentSlot?.slot_data;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs p-5 sm:p-6 space-y-4">
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Live Teaching Bell Status</h2>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Real-time period tracker synced with school bells</p>
          </div>
        </div>
        <div className="text-xs font-mono font-medium text-ink-sub dark:text-ink-sub-dark bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark px-3 py-1.5 rounded-xl w-fit">
          School Hours: {bellSchedule?.school_start_time || '08:00 AM'} – {bellSchedule?.school_end_time || '02:00 PM'} (Fri: {bellSchedule?.friday_end_time || '12:30 PM'})
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4.5 border border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Active Current Session
          </div>
          {currentSlot ? (
            <div>
              {isBreak ? (
                <div className="space-y-1.5">
                  <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Coffee className="w-5 h-5 shrink-0" /> Recess / Break Time
                  </div>
                  <div className="text-xs font-mono font-semibold text-amber-700/80 dark:text-amber-300/80">
                    {currentSlot.start_time} – {currentSlot.end_time}
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Enjoy your break or staff refreshment</p>
                </div>
              ) : isFree ? (
                <div className="space-y-1.5">
                  <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" /> Free Period (Planning / Prep)
                  </div>
                  <div className="text-xs font-mono font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                    {currentSlot.label} ({currentSlot.start_time} – {currentSlot.end_time})
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">No assigned classroom session for this slot</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary shrink-0" />
                    <span>{currentSlot.label}: {slotData?.grade_id?.name || 'Class'} ({slotData?.section || 'A'})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-ink-sub dark:text-ink-sub-dark font-medium">
                    <span className="flex items-center gap-1 text-primary font-bold">
                      <BookOpen className="w-3.5 h-3.5" /> {slotData?.subject_id?.name || 'Subject'}
                    </span>
                    <span className="flex items-center gap-1 text-ink-muted dark:text-ink-muted-dark">
                      <MapPin className="w-3.5 h-3.5" /> {slotData?.room_no || 'Room 101'}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-primary">
                    {currentSlot.start_time} – {currentSlot.end_time}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm font-medium text-ink-muted dark:text-ink-muted-dark py-2">
              No active period currently running (Outside designated school bells)
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4.5 border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Up Next on Schedule
          </div>
          {nextSlot ? (
            <div className="space-y-1.5">
              <div className="text-base font-bold text-ink dark:text-ink-dark">
                {nextSlot.is_break ? 'Recess / Break Time' : nextSlot.is_free ? 'Free Period (Staff Room)' : `${nextSlot.label}: ${nextSlot.slot_data?.grade_id?.name || 'Class'} (${nextSlot.slot_data?.section || 'A'})`}
              </div>
              {!nextSlot.is_break && !nextSlot.is_free && (
                <div className="flex items-center gap-2 text-xs text-ink-sub dark:text-ink-sub-dark font-medium">
                  <span className="text-primary font-bold">{nextSlot.slot_data?.subject_id?.name}</span>
                  <span className="text-ink-muted dark:text-ink-muted-dark">•</span>
                  <span>{nextSlot.slot_data?.room_no}</span>
                </div>
              )}
              <div className="text-xs font-mono font-bold text-primary">{nextSlot.start_time} – {nextSlot.end_time}</div>
            </div>
          ) : (
            <div className="text-sm font-medium text-ink-muted dark:text-ink-muted-dark py-2">
              All scheduled periods completed for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherLiveStatusBanner;
