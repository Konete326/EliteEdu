import { Check, Clock, X, Phone, UserCheck, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScannerActionDispatcher = ({
  data,
  onMarkAttendance,
  marking,
  onResetScan,
  onClose
}) => {
  const navigate = useNavigate();
  if (!data || !data.record) return null;
  const { type, canMarkAttendance, canViewFullProfile, record } = data;

  const handleProfileNav = () => {
    onClose();
    if (type === 'student') navigate(`/admin/students`);
    else navigate(`/admin/teachers`);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/10">
        <div className="w-13 h-13 rounded-2xl bg-primary text-white font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-md">
          {record.photo_url ? (
            <img src={record.photo_url} alt={record.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-base">{record.name?.slice(0, 2).toUpperCase() || 'ID'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark truncate">{record.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              type === 'student' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }`}>
              {type}
            </span>
          </div>
          <p className="text-ink-muted text-[11px] truncate mt-0.5 font-medium">{record.code} • {record.role_or_class}</p>
          <p className="text-ink-muted text-[10px] truncate">{record.campus_name}</p>
        </div>
        <div className="text-right shrink-0">
          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
            record.today_attendance === 'P' ? 'bg-good-soft text-good' :
            record.today_attendance === 'L' ? 'bg-amber-500/15 text-amber-600' :
            record.today_attendance === 'A' ? 'bg-bad-soft text-bad' :
            'bg-slate-200 dark:bg-white/10 text-ink-muted'
          }`}>
            {record.today_attendance === 'P' ? 'Present' : record.today_attendance === 'L' ? 'Late' : record.today_attendance === 'A' ? 'Absent' : 'Not Marked'}
          </span>
          {record.time_recorded && <p className="text-[10px] text-ink-muted mt-1">{record.time_recorded}</p>}
        </div>
      </div>

      {record.emergency_contact && (
        <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Emergency Contact</span>
            <p className="font-mono font-bold text-ink dark:text-ink-dark text-xs">{record.emergency_contact}</p>
          </div>
          <a
            href={`tel:${record.emergency_contact}`}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        </div>
      )}

      {canMarkAttendance ? (
        <div className="p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-ink-dark block">
            Record Today's Attendance
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={marking}
              onClick={() => onMarkAttendance('P')}
              className="py-2.5 rounded-xl bg-good hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Present</span>
            </button>
            <button
              type="button"
              disabled={marking}
              onClick={() => onMarkAttendance('L')}
              className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>Late</span>
            </button>
            <button
              type="button"
              disabled={marking}
              onClick={() => onMarkAttendance('A')}
              className="py-2.5 rounded-xl bg-bad hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Absent</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-line dark:border-white/10 flex items-center gap-2 text-ink-muted">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Security Notice: Read-only profile view mode active for this account.</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-line dark:border-white/10">
        <button
          type="button"
          onClick={onResetScan}
          className="px-3.5 py-2 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-ink-dark font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Scan Next Card</span>
        </button>

        {canViewFullProfile && (
          <button
            type="button"
            onClick={handleProfileNav}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5 shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Full Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ScannerActionDispatcher;
