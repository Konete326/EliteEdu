import { Clock, Coffee, Bell, Sparkles } from 'lucide-react';

const BellScheduleSlotTable = ({ slots = [] }) => {
  if (!slots.length) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No period slots generated yet</p>
        <p className="text-xs text-gray-400 mt-1">Click "⚡ Auto-Generate Period Timings" to calculate your daily bell schedule.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Daily Period & Bell Roster ({slots.length} Slots)
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
          Auto-Calculated
        </span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {slots.map((s) => {
          const isBreak = s.slot_type === 'Break';
          const isAssembly = s.slot_type === 'Assembly';
          return (
            <div
              key={s.slot_no}
              className={`p-3.5 flex items-center justify-between transition-colors ${
                isBreak
                  ? 'bg-amber-50/50 dark:bg-amber-900/10'
                  : isAssembly
                  ? 'bg-purple-50/40 dark:bg-purple-900/10'
                  : 'hover:bg-gray-50/60 dark:hover:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isBreak
                      ? 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300'
                      : isAssembly
                      ? 'bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {isBreak ? <Coffee className="w-3.5 h-3.5" /> : isAssembly ? <Bell className="w-3.5 h-3.5" /> : s.slot_no}
                </span>
                <div>
                  <div className="font-bold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {s.label}
                    {isBreak && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded font-bold">
                        RECESS
                      </span>
                    )}
                    {isAssembly && (
                      <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 rounded font-bold">
                        ASSEMBLY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">Slot #{s.slot_no} • {s.slot_type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                  {s.start_time} – {s.end_time}
                </div>
                <div className="text-[10px] text-gray-400">Bell Rings</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BellScheduleSlotTable;
