import { QrCode, Clock } from 'lucide-react';

const STAFF_STATUSES = [
  { code: 'P', label: 'P', activeClass: 'bg-emerald-600 text-white shadow-xs' },
  { code: 'A', label: 'A', activeClass: 'bg-rose-600 text-white shadow-xs' },
  { code: 'L', label: 'L', activeClass: 'bg-sky-600 text-white shadow-xs' },
  { code: 'LT', label: 'LT', activeClass: 'bg-amber-600 text-white shadow-xs' },
  { code: 'HD', label: 'HD', activeClass: 'bg-purple-600 text-white shadow-xs' },
  { code: 'Hol', label: 'Hol', activeClass: 'bg-indigo-600 text-white shadow-xs' }
];

const StaffAttendanceRow = ({ item, onStatusChange, onTimeChange, onRemarksChange }) => {
  const { staff, status, check_in_time, check_out_time, marked_via, remarks } = item;
  const name = staff.name || 'Staff Member';

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark hover:border-primary/40 transition-all">
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0 border border-line dark:border-line-dark">
          {staff.photo_url ? (
            <img src={staff.photo_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-ink dark:text-ink-dark truncate">{name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {staff.designation || 'Staff'} {staff.bps_grade ? `• BPS-${staff.bps_grade}` : ''}
            </span>
            {marked_via === 'Card_Scan' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                <QrCode className="w-2.5 h-2.5" /> Scanned
              </span>
            )}
          </div>
          <div className="text-[11px] text-ink-muted truncate">
            {staff.employee_code && <>EMP: <span className="font-semibold text-ink dark:text-ink-dark">{staff.employee_code}</span> • </>}
            {staff.personal_id && <>Pers: <span className="font-semibold">{staff.personal_id}</span> • </>}
            <span>{staff.campus_id?.name || 'Main Campus'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-end flex-wrap">
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark gap-1">
          {STAFF_STATUSES.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => onStatusChange(staff._id, opt.code)}
              className={`px-2 py-1 min-w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                status === opt.code
                  ? opt.activeClass
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Clock className="w-3 h-3 text-ink-muted absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={check_in_time || ''}
              placeholder="In: 08:00 AM"
              onChange={(e) => onTimeChange(staff._id, 'check_in_time', e.target.value)}
              className="w-24 pl-6 pr-2 py-1 text-[11px] rounded-lg bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <input
            type="text"
            value={remarks || ''}
            placeholder="Remarks..."
            onChange={(e) => onRemarksChange(staff._id, e.target.value)}
            className="w-28 sm:w-36 px-2.5 py-1 text-xs rounded-lg bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceRow;
