import { Clock, Calendar, Users, Printer, UserCheck } from 'lucide-react';

const MODES = [
  { id: 'timings', label: '1. School & Break Timings', icon: Clock },
  { id: 'class', label: '2. Class-Wise Timetable', icon: Calendar },
  { id: 'teacher', label: '3. Teacher-Wise Schedule', icon: Users },
  { id: 'substitutions', label: '4. Relief / Substitute Teachers', icon: UserCheck }
];

const TimetableHeaderBar = ({ activeMode = 'class', onChangeMode, onPrint }) => (
  <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
        <Clock className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Smart Timetable &amp; Schedule Master</h1>
        <p className="text-xs font-semibold text-ink-muted">Bell schedule, class periods, teacher allocations and live relief cover</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1.5 bg-surface-secondary/60 p-1 rounded-xl border border-line">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = activeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChangeMode(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onPrint}
        className="px-3.5 py-2 bg-surface-secondary/80 text-primary hover:bg-primary/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-line shadow-xs cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Routine</span>
      </button>
    </div>
  </div>
);

export default TimetableHeaderBar;
