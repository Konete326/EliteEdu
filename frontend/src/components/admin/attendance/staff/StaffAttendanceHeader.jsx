import { CalendarCheck, Edit3, ScanLine, Save, Loader2, Users } from 'lucide-react';

const StaffAttendanceHeader = ({
  mode,
  onModeChange,
  summary = {},
  saving = false,
  onSave
}) => {
  const attendanceRate = summary.total > 0
    ? Math.round((summary.present / summary.total) * 100)
    : 0;

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            Institutional Faculty & Staff Attendance
          </h1>
          <p className="text-xs font-semibold text-ink-muted">
            Daily faculty roll call, RFID card terminal scanner, status sync and check-in logs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <div>
            <span className="text-[10px] uppercase font-bold text-primary block">Attendance Rate</span>
            <span className="font-black text-primary">{attendanceRate}% Present</span>
          </div>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/10 shadow-xs">
          <button
            type="button"
            onClick={() => onModeChange('manual')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manual Roll Call</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('scan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'scan'
                ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Card Scanner</span>
          </button>
        </div>

        {mode === 'manual' && (
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Roll Call'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StaffAttendanceHeader;
