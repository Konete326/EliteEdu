import { Search, CheckCheck, XCircle, Calendar, Save, Loader2, Users } from 'lucide-react';
import StaffAttendanceRow from './StaffAttendanceRow';

const StaffManualAttendanceSheet = ({
  search, setSearch,
  filteredRecords = [],
  onStatusChange, onTimeChange, onRemarksChange,
  onMarkAll, onSave,
  saving, loading
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name, EMP code, Pers #, or CNIC..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => onMarkAll('P')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => onMarkAll('A')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Mark All Absent</span>
            </button>
            <button
              type="button"
              onClick={() => onMarkAll('Hol')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Mark Holiday</span>
            </button>
            <button
              type="button"
              disabled={saving || filteredRecords.length === 0}
              onClick={onSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-ink-muted">Loading employees attendance sheet...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-center space-y-2">
          <Users className="w-8 h-8 text-ink-muted mx-auto" />
          <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No Staff Members Found</h4>
          <p className="text-xs text-ink-muted">No active staff members match the selected campus, designation, or search filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRecords.map((item) => (
            <StaffAttendanceRow
              key={item.staff._id}
              item={item}
              onStatusChange={onStatusChange}
              onTimeChange={onTimeChange}
              onRemarksChange={onRemarksChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffManualAttendanceSheet;
