import { Edit3, ScanLine } from 'lucide-react';

const AttendanceHeaderBar = ({ mode, onModeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-line dark:border-line-dark">
      <div>
        <div className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">
          Attendance <span className="mx-1 text-ink-muted/50">&gt;</span> Mark or update Student Attendance
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight mt-0.5">
          Student Attendance
        </h1>
      </div>

      <div className="inline-flex items-center p-1 rounded-xl bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border border-line dark:border-line-dark shadow-xs">
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mode === 'manual'
              ? 'bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Manual Attendance</span>
        </button>
        <button
          type="button"
          onClick={() => onModeChange('scan')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            mode === 'scan'
              ? 'bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>Card Scanning</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceHeaderBar;
