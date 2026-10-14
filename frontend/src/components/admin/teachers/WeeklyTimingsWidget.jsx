import { Clock, Zap } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyTimingsWidget = ({ weeklyTimings = [], onTimingsChange }) => {
  const timings = weeklyTimings.length > 0
    ? weeklyTimings
    : DAYS.map((day) => ({ day, is_working: true, start_time: '08:00', end_time: '14:00' }));

  const handleApplyToAll = () => {
    const monday = timings.find((t) => t.day === 'Monday') || { start_time: '08:00', end_time: '14:00' };
    onTimingsChange(timings.map((t) => ({ ...t, start_time: monday.start_time, end_time: monday.end_time })));
  };

  const handleTimingToggle = (day) => {
    onTimingsChange(timings.map((t) => (t.day === day ? { ...t, is_working: !t.is_working } : t)));
  };

  const handleTimeChange = (day, field, val) => {
    onTimingsChange(timings.map((t) => (t.day === day ? { ...t, [field]: val } : t)));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Weekly Timings</h3>
        </div>
        <button
          type="button"
          onClick={handleApplyToAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors"
        >
          <Zap className="w-3 h-3" /> Apply Monday to All
        </button>
      </div>

      <div className="space-y-1.5">
        {timings.map((t) => (
          <div key={t.day} className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-surface-secondary/40 text-xs">
            <label className="flex items-center gap-2 cursor-pointer w-28">
              <input
                type="checkbox"
                checked={t.is_working}
                onChange={() => handleTimingToggle(t.day)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className={`font-semibold ${t.is_working ? 'text-ink dark:text-ink-dark' : 'text-ink-muted line-through'}`}>{t.day}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                disabled={!t.is_working}
                value={t.start_time || '08:00'}
                onChange={(e) => handleTimeChange(t.day, 'start_time', e.target.value)}
                className="px-2 py-0.5 rounded-lg border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none disabled:opacity-40"
              />
              <span className="text-ink-muted">-</span>
              <input
                type="time"
                disabled={!t.is_working}
                value={t.end_time || '14:00'}
                onChange={(e) => handleTimeChange(t.day, 'end_time', e.target.value)}
                className="px-2 py-0.5 rounded-lg border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none disabled:opacity-40"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyTimingsWidget;
