import { Check, CheckCircle2, Undo2, X, UserPlus, Pencil, Trash2, Eye } from 'lucide-react';

const STATUS_STYLES = {
  'Pending Verification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Verified': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  'Approved': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'Converted': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  'Rejected': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
};

const ApplicantTableRow = ({
  applicant,
  onStatusChange,
  onOpenConvert,
  onOpenSalary,
  onView,
  onEdit,
  onDelete
}) => {
  const status = applicant.status || 'Pending Verification';
  const statusBadgeClass = STATUS_STYLES[status] || STATUS_STYLES['Pending Verification'];

  const initials = (applicant.name || 'A')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const appliedDate = applicant.applied_on
    ? new Date(applicant.applied_on).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const rep = applicant.replacement_staff;

  return (
    <tr className="border-b border-line/60 dark:border-white/5 hover:bg-surface-secondary/30 dark:hover:bg-white/[0.02] transition-colors text-xs text-ink dark:text-ink-dark">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5">
          {applicant.photo_url ? (
            <img src={applicant.photo_url} alt={applicant.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-line dark:border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-white/10 flex items-center justify-center font-bold text-[11px] text-ink-muted dark:text-ink-muted-dark shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onView(applicant)}
              className="font-semibold text-ink dark:text-ink-dark hover:text-primary transition-colors text-left truncate block max-w-[150px]"
            >
              {applicant.name}
            </button>
            <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark truncate block max-w-[150px]">
              {applicant.contact_number || applicant.email || applicant.campus_id?.name || '—'}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 px-3 text-ink-muted dark:text-ink-muted-dark font-medium">
        {applicant.department || '—'}
      </td>

      <td className="py-3 px-3 text-ink-muted dark:text-ink-muted-dark font-medium">
        {applicant.designation || '—'}
      </td>

      <td className="py-3 px-3 text-ink-muted dark:text-ink-muted-dark font-medium whitespace-nowrap">
        {appliedDate}
      </td>

      <td className="py-3 px-3 text-ink-muted dark:text-ink-muted-dark font-medium whitespace-nowrap">
        {applicant.availability || '—'}
      </td>

      <td className="py-3 px-3">
        {rep ? (
          <div className="flex items-center gap-1.5">
            {rep.photo_url ? (
              <img src={rep.photo_url} alt={rep.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                {(rep.name || 'T')[0]}
              </div>
            )}
            <span className="text-xs font-semibold text-ink dark:text-ink-dark truncate max-w-[160px]">
              {rep.name} {rep.basic_salary ? `- Rs. ${rep.basic_salary.toLocaleString()}` : ''}
            </span>
          </div>
        ) : (
          <span className="text-ink-muted dark:text-ink-muted-dark">—</span>
        )}
      </td>

      <td className="py-3 px-3 font-semibold text-ink-sub dark:text-ink-sub-dark whitespace-nowrap">
        {applicant.expected_salary ? `Rs. ${applicant.expected_salary.toLocaleString()}` : '—'}
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onOpenSalary(applicant)}
          className="font-bold text-ink dark:text-ink-dark hover:text-primary transition-colors cursor-pointer"
        >
          {applicant.approved_salary ? `Rs. ${applicant.approved_salary.toLocaleString()}` : '—'}
        </button>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeClass}`}>
          {status}
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          {status === 'Pending Verification' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Verified')}
                title="Verify Applicant"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-blue-500 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Rejected')}
                title="Reject Applicant"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {status === 'Verified' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Pending Verification')}
                title="Revert to Pending"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenSalary(applicant)}
                title="Approve Applicant & Set Salary"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-emerald-500 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Rejected')}
                title="Reject Applicant"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {status === 'Approved' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Verified')}
                title="Revert to Verified"
                className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenConvert(applicant)}
                title="1-Click Convert to Staff / Teacher"
                className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </>
          )}

          {status === 'Converted' && (
            <button
              type="button"
              onClick={() => onView(applicant)}
              title="View Applicant Profile"
              className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-indigo-500 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {status === 'Rejected' && (
            <button
              type="button"
              onClick={() => onStatusChange(applicant._id, 'Pending Verification')}
              title="Revert to Pending"
              className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(applicant)}
            title="Edit Applicant"
            className="p-1 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(applicant)}
            title="Delete Applicant"
            className="p-1 rounded-lg hover:bg-bad-soft dark:hover:bg-bad/10 text-bad transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApplicantTableRow;
