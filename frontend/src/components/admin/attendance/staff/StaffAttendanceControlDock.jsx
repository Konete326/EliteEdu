import { Calendar, Building2, Briefcase } from 'lucide-react';
import StaffAttendanceStatsCard from './StaffAttendanceStatsCard';

const DESIGNATIONS = [
  'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE_HEADMASTER',
  'SECTION_INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB_QASID',
  'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON', 'OTHER'
];

const StaffAttendanceControlDock = ({
  date, setDate,
  campuses = [], campusId, setCampusId,
  designation, setDesignation,
  summary = {}, totalStaff = 0
}) => {
  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    setDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Attendance Date *</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted hover:text-ink transition-all cursor-pointer"
              >
                Yesterday
              </button>
            </div>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Campus (Optional)</span>
          </label>
          <select
            value={campusId}
            onChange={(e) => setCampusId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          >
            <option value="ALL">All Campuses</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            <span>Designation / Scale</span>
          </label>
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          >
            <option value="ALL">All Designations</option>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <StaffAttendanceStatsCard summary={summary} total={totalStaff} />
    </div>
  );
};

export default StaffAttendanceControlDock;
