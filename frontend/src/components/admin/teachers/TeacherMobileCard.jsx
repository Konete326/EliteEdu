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
  Clock,
  BookOpen,
  Mail,
  Phone,
  Building2,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePermissions from '../../../hooks/usePermissions';

const TeacherMobileCard = ({
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
    <div className="p-4 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-xs space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary dark:text-primary-dark font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-ink dark:text-white truncate">{teacher.name}</h4>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark truncate">
              {teacher.designation || 'Faculty'} {teacher.bps_grade ? `• ${teacher.bps_grade}` : ''}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-ink-muted">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{teacher.campus_id?.name || 'Main School'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/60 dark:border-white/5">
        {live?.status === 'in_class' ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-accent/10 border border-accent/30 text-accent dark:text-accent-dark text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              In Class: {live.grade_name} {live.subject_name} (Period {live.period_no})
            </span>
          </div>
        ) : live?.status === 'free' ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-info/10 border border-info/30 text-info dark:text-info-dark text-[11px] font-semibold">
            <Clock className="w-3 h-3" />
            <span>Free Period (Staff Room)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-secondary dark:bg-[#1a1a1a] text-ink-muted text-[10px] font-medium">
            <span>No Current Class</span>
          </div>
        )}

        {attendance?.status === 'P' || attendance?.status === 'Present' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-good/10 text-good dark:text-good-dark border border-good/20 text-[10px] font-bold">
            Present {attendance.check_in ? `(${attendance.check_in})` : ''}
          </span>
        ) : attendance?.status === 'Late' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-accent/15 text-accent border border-accent/25 text-[10px] font-bold">
            Late {attendance.check_in ? `(${attendance.check_in})` : ''}
          </span>
        ) : attendance?.status === 'Absent' || attendance?.status === 'A' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-bad/10 text-bad border border-bad/20 text-[10px] font-bold">
            Absent
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-secondary text-ink-muted text-[10px] font-medium">
            Attendance: Not Marked
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-muted dark:text-ink-muted-dark bg-surface-secondary/40 dark:bg-[#181818] p-2.5 rounded-xl">
        <div className="flex items-center gap-1.5 truncate">
          <Hash className="w-3 h-3 shrink-0 text-primary" />
          <span className="truncate font-mono">{teacher.employee_code || teacher.personal_id || 'No ID'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Phone className="w-3 h-3 shrink-0 text-primary" />
          <span className="truncate">{teacher.contact_number || teacher.whatsapp_number || 'No Phone'}</span>
        </div>
        {teacher.email && (
          <div className="flex items-center gap-1.5 col-span-2 truncate">
            <Mail className="w-3 h-3 shrink-0 text-primary" />
            <span className="truncate">{teacher.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/60 dark:border-white/5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {teacher.subjects?.length > 0 ? (
            teacher.subjects.slice(0, 2).map((s) => (
              <span
                key={s._id}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary truncate max-w-[90px]"
              >
                {s.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-ink-muted italic">No Subjects</span>
          )}
          {teacher.subjects?.length > 2 && (
            <span className="text-[10px] font-bold text-ink-muted">+{teacher.subjects.length - 2}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => onAssignPeriod && onAssignPeriod(teacher)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Assign</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(teacher)}
            className="p-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] text-ink hover:text-primary transition-all cursor-pointer"
            title="Edit Teacher"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] text-ink hover:text-primary transition-all cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-surface dark:bg-[#181818] border border-line dark:border-white/15 shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95">
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
      </div>
    </div>
  );
};

export default TeacherMobileCard;