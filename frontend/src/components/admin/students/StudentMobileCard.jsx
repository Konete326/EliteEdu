import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Pencil,
  Trash2,
  Eye,
  CreditCard,
  Award,
  ShieldCheck,
  Building2,
  Phone,
  MoreVertical,
  Users,
  GraduationCap
} from 'lucide-react';
import usePermissions from '../../../hooks/usePermissions';

const StudentMobileCard = ({
  student,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  onOpenLedger,
  onOpenAttendance,
  onOpenAdmissionLetter,
  onOpenIdCard
}) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('students');
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

  const isActive = student.status === 'Active';
  const initials = student.name
    ? student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';
  const admissionDateStr = student.admission_date ? new Date(student.admission_date).toLocaleDateString() : '';

  return (
    <div className="p-4 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-xs space-y-3.5 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-primary-dark font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-2xs">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-ink dark:text-white truncate">{student.name}</h4>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark truncate">
              {student.father_name ? `S/O ${student.father_name}` : 'Father: —'}
              {student.family_number ? ` • Family #${student.family_number}` : ''}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-ink-muted dark:text-ink-muted-dark">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{student.campus_id?.name || 'Main School'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => onToggleStatus && onToggleStatus(student._id, student.status)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              isActive ? 'bg-primary dark:bg-primary-dark' : 'bg-bad/70'
            }`}
            title={`Status: ${student.status || 'Active'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/60 dark:border-white/5 text-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-secondary/70 dark:bg-[#1a1a1a] border border-line dark:border-white/10 text-ink dark:text-ink-dark font-mono text-[11px]">
          <span className="text-ink-muted">GR:</span>
          <span className="font-bold">{student.gr_number || '—'}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark border border-primary/20 font-semibold text-[11px]">
          <GraduationCap className="w-3 h-3 shrink-0" />
          <span>{student.current_grade?.name || 'Unassigned'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/40 dark:bg-black/20 text-[10px] font-bold">
            Sec {student.current_section || 'A'}
          </span>
        </div>

        {student.elective_stream && student.elective_stream !== 'None' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-accent/10 border border-accent/20 text-accent dark:text-accent-dark">
            {student.elective_stream}
          </span>
        )}

        <div className="ml-auto inline-flex items-center text-xs font-bold text-ink dark:text-white">
          <span>Rs. {(student.monthly_fee || 0).toLocaleString()}</span>
          <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-normal ml-0.5">/mo</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-ink-muted dark:text-ink-muted-dark pt-0.5">
        <div className="flex items-center gap-1.5 truncate">
          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
          {student.contact_number ? (
            <a
              href={`tel:${student.contact_number}`}
              className="font-mono text-xs hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              {student.contact_number}
            </a>
          ) : (
            <span className="text-[11px]">No contact</span>
          )}
        </div>
        {admissionDateStr && (
          <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark shrink-0">
            Admitted: {admissionDateStr}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-line/60 dark:border-white/5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onOpenLedger(student)}
            className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark hover:text-primary dark:hover:text-primary-dark bg-surface-secondary/50 dark:bg-[#181818] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAttendance(student)}
            className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark hover:text-primary dark:hover:text-primary-dark bg-surface-secondary/50 dark:bg-[#181818] transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => onView(student)}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1f1f1f] text-ink-muted hover:text-ink dark:hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(student)}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20 transition-colors"
            title="Edit Student"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="min-h-[38px] w-9 flex items-center justify-center rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-[#1f1f1f] text-ink-muted hover:text-ink dark:hover:text-white transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-48 rounded-xl bg-surface dark:bg-[#161616] border border-line dark:border-white/10 shadow-xl py-1.5 z-30 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenIdCard(student);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-[#202020] text-left"
              >
                <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Print ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAdmissionLetter(student);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-[#202020] text-left"
              >
                <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Admission Letter</span>
              </button>

              <Link
                to={`/admin/reports/report-cards?studentId=${student._id}`}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-[#202020] text-left"
              >
                <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Report Card</span>
              </Link>

              <Link
                to={`/admin/certificates?studentId=${student._id}`}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-[#202020] text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Certificate</span>
              </Link>

              {hasDelete && (
                <>
                  <div className="my-1 border-t border-line/60 dark:border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(student);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-bad hover:bg-bad-soft dark:hover:bg-bad/20 text-left font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Delete Student</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMobileCard;
