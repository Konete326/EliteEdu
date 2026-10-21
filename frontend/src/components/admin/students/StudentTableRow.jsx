import { Link } from 'react-router-dom';
import { FileText, Calendar, Pencil, Trash2, Eye, CreditCard, Award, ShieldCheck } from 'lucide-react';
import usePermissions from '../../../hooks/usePermissions';

const StudentTableRow = ({ student, onEdit, onDelete, onView, onOpenLedger, onOpenAttendance, onOpenAdmissionLetter, onOpenIdCard }) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('students');
  const initials = student.name ? student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  const admissionDateStr = student.admission_date ? new Date(student.admission_date).toLocaleDateString() : '—';

  return (
    <tr className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
      <td className="px-5 py-3.5 text-xs font-medium text-ink-sub dark:text-ink-sub-dark max-w-[130px] truncate">
        {student.campus_id?.name || 'Main School'}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:text-primary-dark font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div>
            <p className="font-bold text-ink dark:text-ink-dark text-sm">{student.name}</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark truncate max-w-[180px]">
              {student.father_name || '—'} {student.family_number ? `• Family #${student.family_number}` : ''}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <p className="font-bold text-xs text-ink dark:text-ink-dark font-mono">{student.gr_number}</p>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">{admissionDateStr}</p>
      </td>
      <td className="px-5 py-3.5">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark border border-primary/20">
          {student.current_grade?.name || 'Unassigned'}
        </span>
        {student.elective_stream && student.elective_stream !== 'None' && (
          <span className="block mt-0.5 text-[10px] font-bold text-accent truncate max-w-[120px]">
            {student.elective_stream}
          </span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-surface-secondary dark:bg-[#202020] border border-line dark:border-white/10 text-ink dark:text-ink-dark">
          {student.current_section || 'A'}
        </span>
      </td>
      <td className="px-5 py-3.5 text-xs text-ink-muted dark:text-ink-muted-dark font-mono">
        {student.contact_number || '—'}
      </td>
      <td className="px-5 py-3.5 text-xs font-semibold text-ink dark:text-ink-dark">
        Rs. {(student.monthly_fee || 0).toLocaleString()}
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-good-soft dark:bg-good/20 text-good dark:text-good-dark border border-good/30' : 'bg-bad-soft dark:bg-bad/20 text-bad dark:text-bad-dark border border-bad/30'}`}>
          {student.status || 'Active'}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={() => onOpenLedger(student)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line dark:border-white/10 text-xs font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-[#1f1f1f] transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Ledger</span>
        </button>
      </td>
      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={() => onOpenAttendance(student)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line dark:border-white/10 text-xs font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-[#1f1f1f] transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Attendance</span>
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => onOpenAdmissionLetter(student)} title="Admission Letter" className="p-1.5 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20">
            <FileText className="w-4 h-4 text-primary" />
          </button>
          <button type="button" onClick={() => onOpenIdCard(student)} title="Print ID Card" className="p-1.5 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20">
            <CreditCard className="w-4 h-4 text-primary" />
          </button>
          <Link to={`/admin/reports/report-cards?studentId=${student._id}`} title="Report Card" className="p-1.5 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20">
            <Award className="w-4 h-4 text-primary" />
          </Link>
          <Link to={`/admin/certificates?studentId=${student._id}`} title="Generate Certificate" className="p-1.5 rounded-lg text-ink-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </Link>
          <button type="button" onClick={() => onView(student)} title="View Details" className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-[#1f1f1f]">
            <Eye className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onEdit(student)} title="Edit Student" className="p-1.5 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20">
            <Pencil className="w-4 h-4" />
          </button>
          {hasDelete && (
            <button type="button" onClick={() => onDelete(student)} title="Delete Student" className="p-1.5 rounded-lg text-bad/80 hover:text-bad hover:bg-bad-soft dark:hover:bg-bad/20">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StudentTableRow;
