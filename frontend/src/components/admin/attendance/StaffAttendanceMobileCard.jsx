import { User } from 'lucide-react';

const STATUSES = [
  { key: 'Present', label: 'P', name: 'Present', active: 'bg-emerald-600 text-white border-emerald-600' },
  { key: 'Absent', label: 'A', name: 'Absent', active: 'bg-rose-600 text-white border-rose-600' },
  { key: 'Late', label: 'L', name: 'Late', active: 'bg-amber-600 text-white border-amber-600' },
  { key: 'Half_Day', label: 'HD', name: 'Half Day', active: 'bg-purple-600 text-white border-purple-600' }
];

const StaffAttendanceMobileCard = ({ mem, record, onStatusChange, onRemarksChange, index }) => {
  const currentStatus = record?.status || 'Present';

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-white/10 bg-surface dark:bg-surface-dark space-y-3 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-primary/20">
            {mem.photo_url ? (
              <img src={mem.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-ink dark:text-white truncate">{mem.name}</h4>
            <p className="text-[11px] text-ink-muted truncate">
              {mem.designation || mem.role || 'Teacher'} • <span className="font-mono">{mem.employee_id || mem.code || `EMP-${index + 1}`}</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-secondary text-ink dark:text-white shrink-0">
          {currentStatus}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 pt-1">
        {STATUSES.map((st) => {
          const isSelected = currentStatus === st.key;
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => onStatusChange(mem._id, st.key)}
              className={`min-h-[40px] flex items-center justify-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSelected
                  ? st.active
                  : 'bg-surface-secondary/50 dark:bg-white/5 border-line dark:border-white/10 text-ink-muted hover:text-ink hover:border-primary/40'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>

      <div>
        <input
          type="text"
          value={record?.remarks || ''}
          onChange={(e) => onRemarksChange(mem._id, e.target.value)}
          placeholder="Remarks / Note (Optional)..."
          className="w-full h-9 px-3 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 text-ink dark:text-white placeholder:text-ink-muted/60 focus:outline-hidden focus:border-primary"
        />
      </div>
    </div>
  );
};

export default StaffAttendanceMobileCard;

