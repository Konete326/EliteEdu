import { QrCode } from 'lucide-react';

const STATUS_OPTIONS = [
  { code: 'P', label: 'P', activeClass: 'bg-emerald-600 text-white shadow-xs' },
  { code: 'A', label: 'A', activeClass: 'bg-rose-600 text-white shadow-xs' },
  { code: 'L', label: 'L', activeClass: 'bg-sky-600 text-white shadow-xs' },
  { code: 'LT', label: 'LT', activeClass: 'bg-amber-600 text-white shadow-xs' },
  { code: 'HD', label: 'HD', activeClass: 'bg-purple-600 text-white shadow-xs' }
];

const StudentAttendanceRow = ({ item, onStatusChange, onRemarksChange }) => {
  const { student, status, marked_via, remarks } = item;
  const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark hover:border-primary/40 transition-all">
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0 border border-line dark:border-line-dark">
          {student.photo_url ? (
            <img src={student.photo_url} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span>{fullName.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-ink dark:text-ink-dark truncate">{fullName}</span>
            {marked_via === 'Card_Scan' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                <QrCode className="w-2.5 h-2.5" /> Scan
              </span>
            )}
          </div>
          <div className="text-[11px] text-ink-muted truncate">
            GR: <span className="font-semibold text-ink dark:text-ink-dark">{student.gr_number || 'N/A'}</span>
            {student.roll_number && <> • Roll: <span className="font-semibold">{student.roll_number}</span></>}
            {student.father_name && <> • S/O {student.father_name}</>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => onStatusChange(student._id, opt.code)}
              className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                status === opt.code
                  ? opt.activeClass
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={remarks || ''}
          placeholder="Remarks..."
          onChange={(e) => onRemarksChange(student._id, e.target.value)}
          className="w-full sm:w-36 px-2.5 py-1 text-xs rounded-lg bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>
    </div>
  );
};

export default StudentAttendanceRow;
