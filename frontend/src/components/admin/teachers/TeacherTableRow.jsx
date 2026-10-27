import { useState, useRef, useEffect } from 'react';
import {
  CalendarPlus,
  Pencil,
  MoreVertical,
  IdCard,
  CreditCard,
  ShieldCheck,
  KeyRound,
  Trash2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePermissions from '../../../hooks/usePermissions';

const TeacherTableRow = ({
  teacher,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  onOpenPassword,
  onAssignPeriod
}) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('teachers');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const isActive = teacher.status === 'Active';
  const initials = teacher.name
    ? teacher.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'TC';

  const live = teacher.live_activity;
  const attendance = teacher.attendance_today;

  return (
    <tr className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors text-xs border-b border-line/60 dark:border-white/5">
      <td className="px-4 py-3 font-medium text-ink-sub dark:text-ink-sub-dark max-w-[120px] truncate">
        {teacher.campus_id?.name || 'Main School'}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:text-primary-dark font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 max-w-[180px]">
            <p className="font-bold text-ink dark:text-ink-dark text-sm truncate">{teacher.name}</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark truncate">
              {teacher.designation || 'Faculty'} {teacher.bps_grade ? `• ${teacher.bps_grade}` : ''}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        {live?.status === 'in_class' ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-accent/10 border border-accent/30 text-accent dark:text-accent-dark text-[11px] font-bold">
            <span className="inline-flex rounded-full h-2 w-2 bg-accent" />
            <span className="truncate max-w-[170px]" title={`In Class: ${live.grade_name} ${live.subject_name}`}>
              {live.grade_name} {live.subject_name} (P{live.period_no})
            </span>
          </div>
        ) : live?.status === 'free' ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-info/10 border border-info/30 text-info dark:text-info-dark text-[11px] font-semibold">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Free Period</span>
          </div>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-secondary text-ink-muted text-[10px]">
            No Slots Today
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {attendance?.status === 'P' || attendance?.status === 'Present' ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-good/10 text-good dark:text-good-dark border border-good/20 text-[11px] font-bold">
            <span>Present</span>
            {attendance.check_in && (
              <span className="text-[10px] font-mono opacity-85">({attendance.check_in})</span>
            )}
          </div>
        ) : attendance?.status === 'Late' ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-accent/15 text-accent border border-accent/25 text-[11px] font-bold">
            <span>Late</span>
            {attendance.check_in && (
              <span className="text-[10px] font-mono opacity-85">({attendance.check_in})</span>
            )}
          </div>
        ) : attendance?.status === 'Absent' || attendance?.status === 'A' ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-bad/10 text-bad border border-bad/20 text-[11px] font-bold">
            Absent
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-surface-secondary text-ink-muted text-[10px]">
            Not Marked
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        <p className="font-bold font-mono text-ink dark:text-ink-dark">{teacher.employee_code || '—'}</p>
        <p className="text-[11px] text-ink-muted truncate max-w-[150px]">
          {teacher.contact_number || teacher.email || '—'}
        </p>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {teacher.subjects?.length > 0 ? (
            teacher.subjects.slice(0, 2).map((s) => (
              <span
                key={s._id}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary truncate max-w-[80px]"
              >
                {s.name}
              </span>
            ))
          ) : (
            <span className="text-ink-muted text-[11px]">—</span>
          )}
          {teacher.subjects?.length > 2 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary text-ink-muted">
              +{teacher.subjects.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-center">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => onToggleStatus(teacher._id, teacher.status)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            isActive ? 'bg-primary dark:bg-primary-dark' : 'bg-bad/70'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
              isActive ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => onAssignPeriod && onAssignPeriod(teacher)}
            title="Assign Period"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Assign</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(teacher)}
            title="Edit Teacher"
            className="p-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] text-ink hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            title="More Options"
            className="p-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] text-ink hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-surface dark:bg-[#181818] border border-line dark:border-white/15 shadow-xl z-30 py-1.5 text-xs text-left animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView(teacher);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-ink dark:text-white hover:bg-surface-secondary dark:hover:bg-[#222222]"
              >
                <IdCard className="w-4 h-4 text-primary" />
                <span>View Full Profile</span>
              </button>

              <Link
                to={`/admin/teachers/id-cards?teacherId=${teacher._id}`}
                onClick={() => setMenuOpen(false)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-ink dark:text-white hover:bg-surface-secondary dark:hover:bg-[#222222]"
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Service ID Card</span>
              </Link>

              <Link
                to={`/admin/certificates?staffId=${teacher._id}`}
                onClick={() => setMenuOpen(false)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-ink dark:text-white hover:bg-surface-secondary dark:hover:bg-[#222222]"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Staff Certificate</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPassword(teacher);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-ink dark:text-white hover:bg-surface-secondary dark:hover:bg-[#222222]"
              >
                <KeyRound className="w-4 h-4 text-accent" />
                <span>Change Password</span>
              </button>

              {hasDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(teacher);
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-bad hover:bg-bad-soft dark:hover:bg-bad/20 border-t border-line/60 dark:border-white/5 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Faculty</span>
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TeacherTableRow;