import { useState } from 'react';
import { Clock, Coffee, Bell, Calendar } from 'lucide-react';

const BellScheduleSlotTable = ({ slots = [], fridaySlots = [] }) => {
  const [activeDayMode, setActiveDayMode] = useState('regular');
  const activeSlots = activeDayMode === 'friday' && fridaySlots.length > 0 ? fridaySlots : slots;

  if (!slots.length && !fridaySlots.length) {
    return (
      <div className="p-8 text-center bg-surface-secondary/40 rounded-2xl border border-dashed border-line dark:border-line-dark">
        <Clock className="w-8 h-8 text-ink-muted mx-auto mb-2" />
        <p className="text-sm font-semibold text-ink dark:text-ink-dark">No period slots generated yet</p>
        <p className="text-xs text-ink-muted mt-1">Select a Summer/Winter preset or click &quot;Preview Slot Timings&quot; to calculate your Pakistani bell schedule.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark overflow-hidden shadow-xs space-y-0">
      <div className="p-4 border-b border-line dark:border-line-dark flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Bell Timings &amp; Periods Roster</span>
          </h3>
          <p className="text-[11px] text-ink-muted">
            {activeDayMode === 'regular' ? 'Regular Schedule (Monday to Thursday & Saturday)' : 'Friday Jumma Half-Day Early Off Routine'}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-secondary/60 p-1 rounded-xl border border-line dark:border-line-dark self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveDayMode('regular')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeDayMode === 'regular'
                ? 'bg-primary text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Regular Days ({slots.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveDayMode('friday')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeDayMode === 'friday'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Friday Jumma ({fridaySlots.length || slots.length})</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-line dark:divide-line-dark max-h-[460px] overflow-y-auto">
        {activeSlots.map((s) => {
          const isBreak = s.slot_type === 'Break';
          const isAssembly = s.slot_type === 'Assembly';
          return (
            <div
              key={s.slot_no}
              className={`p-3.5 flex items-center justify-between transition-colors ${
                isBreak
                  ? 'bg-amber-500/5 dark:bg-amber-500/10'
                  : isAssembly
                  ? 'bg-purple-500/5 dark:bg-purple-500/10'
                  : 'hover:bg-surface-secondary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isBreak
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : isAssembly
                      ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {isBreak ? <Coffee className="w-3.5 h-3.5" /> : isAssembly ? <Bell className="w-3.5 h-3.5" /> : s.slot_no}
                </span>
                <div>
                  <div className="font-bold text-xs text-ink dark:text-ink-dark flex items-center gap-2">
                    {s.label}
                    {isBreak && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded font-bold">
                        RECESS / INTERVAL
                      </span>
                    )}
                    {isAssembly && (
                      <span className="text-[10px] px-2 py-0.5 bg-purple-500/15 text-purple-700 dark:text-purple-300 rounded font-bold">
                        MORNING ASSEMBLY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-muted font-medium">Slot #{s.slot_no} • {s.slot_type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-xs text-primary">
                  {s.start_time} – {s.end_time}
                </div>
                <div className="text-[10px] text-ink-muted">Bell Time</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BellScheduleSlotTable;
