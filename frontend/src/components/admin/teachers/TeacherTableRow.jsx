import { Pencil, Trash2, IdCard, KeyRound, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherTableRow = ({ teacher, onToggleStatus, onEdit, onDelete, onView, onOpenPassword }) => {
  const isActive = teacher.status === 'Active';
  const initials = teacher.name
    ? teacher.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TC';

  return (
    <tr className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors text-xs">
      <td className="px-5 py-3.5 font-medium text-ink-sub dark:text-ink-sub-dark max-w-[140px] truncate">
        {teacher.campus_id?.name || 'Main School'}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:text-primary-dark font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div>
            <p className="font-bold text-ink dark:text-ink-dark text-sm">{teacher.name}</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
              {teacher.designation || 'Staff'} {teacher.bps_grade ? `• ${teacher.bps_grade}` : ''}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <p className="font-bold text-ink dark:text-ink-dark">{teacher.employee_code || '—'}</p>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">{teacher.personal_id || '—'}</p>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-ink-sub dark:text-ink-sub-dark truncate max-w-[180px]">{teacher.email}</p>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
          {teacher.contact_number || teacher.whatsapp_number || '—'}
        </p>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {teacher.subjects?.length > 0 ? (
            teacher.subjects.slice(0, 3).map((s) => (
              <span key={s._id} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
                {s.name}
              </span>
            ))
          ) : <span className="text-ink-muted">—</span>}
          {teacher.subjects?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-secondary text-ink-muted">
              +{teacher.subjects.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {teacher.grades?.length > 0 ? (
            teacher.grades.slice(0, 3).map((g) => (
              <span key={g._id} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ink text-white dark:bg-[#262626]">
                {g.name}
              </span>
            ))
          ) : <span className="text-ink-muted">—</span>}
          {teacher.grades?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-secondary text-ink-muted">
              +{teacher.grades.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5 text-center">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => onToggleStatus(teacher._id, teacher.status)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            isActive ? 'bg-primary dark:bg-primary-dark' : 'bg-bad/80 dark:bg-bad/70'
          }`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/teachers/id-cards?teacherId=${teacher._id}`}
            title="Service ID Card"
            className="p-1.5 rounded-lg text-ink-muted hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            <CreditCard className="w-4 h-4" />
          </Link>
          <button type="button" onClick={() => onView(teacher)} title="View Details" className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary">
            <IdCard className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onOpenPassword(teacher)} title="Change Password" className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary-soft">
            <KeyRound className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onEdit(teacher)} title="Edit Teacher" className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary-soft">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onDelete(teacher)} title="Delete Teacher" className="p-1.5 rounded-lg text-bad/80 hover:text-bad hover:bg-bad-soft">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeacherTableRow;
