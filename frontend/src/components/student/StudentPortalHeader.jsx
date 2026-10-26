import { Bus, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const StudentPortalHeader = ({ student, attendance = {}, invoices = [] }) => {
  if (!student) return null;
  const unpaidCount = invoices.filter((inv) => inv.status !== 'Paid').length;

  return (
    <div className="bg-surface dark:bg-surface-dark p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 sm:gap-4">
        {student.photo_url ? (
          <img
            src={student.photo_url}
            alt={student.name}
            loading="lazy"
            decoding="async"
            className="w-14 h-14 rounded-2xl object-cover border border-line dark:border-line-dark shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary dark:text-primary-dark font-black text-xl flex items-center justify-center border border-primary/20 shrink-0">
            {student.name?.charAt(0) || 'S'}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-ink-dark truncate">{student.name}</h2>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary-soft text-primary dark:text-primary-dark border border-primary/20 shrink-0">
              {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
            </span>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
              Active
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            s/o {student.father_name || '—'} • GR #: <span className="font-mono font-bold text-ink dark:text-ink-dark">{student.gr_number || '—'}</span>
            {student.campus_id?.name ? ` • ${student.campus_id.name}` : ''}
          </p>
          {student.transport_route && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warn-dark bg-warn-soft/60 px-2 py-0.5 rounded-md mt-1.5 border border-warn/20">
              <Bus className="w-3 h-3" /> Transport: {student.transport_route}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-stretch md:self-auto justify-end">
        <div className="flex-1 md:flex-initial p-2.5 sm:p-3 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl border border-line dark:border-line-dark text-center min-w-[100px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">Attendance</span>
          <h4 className="text-base sm:text-lg font-black text-good dark:text-good-dark flex items-center justify-center gap-1 mt-0.5">
            <CheckCircle2 className="w-4 h-4" /> {attendance.attendancePct || 100}%
          </h4>
        </div>
        <div className="flex-1 md:flex-initial p-2.5 sm:p-3 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl border border-line dark:border-line-dark text-center min-w-[100px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">Fee Invoices</span>
          <h4 className={`text-base sm:text-lg font-black flex items-center justify-center gap-1 mt-0.5 ${unpaidCount > 0 ? 'text-bad dark:text-bad-dark' : 'text-good dark:text-good-dark'}`}>
            {unpaidCount > 0 ? <AlertCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{unpaidCount > 0 ? `${unpaidCount} Due` : 'All Paid'}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalHeader;
