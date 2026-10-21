import {
  Check,
  CheckCircle2,
  Undo2,
  X,
  UserPlus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ExternalLink
} from 'lucide-react';

const STATUS_STYLES = {
  'Pending Verification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Verified': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Approved': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'Converted': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
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

  const appliedDate = applicant.applied_on || applicant.createdAt
    ? new Date(applicant.applied_on || applicant.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const resumeHref = applicant.resume_url || (applicant.documents?.length > 0 ? applicant.documents[0].file_url : null);
  const resumeLabel = applicant.resume_name || (applicant.documents?.length > 0 ? applicant.documents[0].title : 'Resume/CV');

  return (
    <tr className="hover:bg-surface-secondary/40 dark:hover:bg-white/[0.02] transition-colors text-xs text-ink dark:text-white">
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-2.5">
          {applicant.photo_url ? (
            <img
              src={applicant.photo_url}
              alt={applicant.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-line dark:border-white/10 shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onView(applicant)}
              className="font-bold text-ink dark:text-white hover:text-primary transition-colors text-left truncate block max-w-[160px] cursor-pointer"
            >
              {applicant.name}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-ink-muted truncate max-w-[180px]">
              {applicant.contact_number && <span>{applicant.contact_number}</span>}
              {applicant.cnic && <span>• {applicant.cnic}</span>}
            </div>
          </div>
        </div>
      </td>

      <td className="py-3 px-3">
        <p className="font-semibold text-ink dark:text-white truncate max-w-[140px]">
          {applicant.designation || 'Staff Candidate'}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-ink-muted mt-0.5 truncate max-w-[150px]">
          <span>{applicant.department || 'Academics'}</span>
          {applicant.campus_id?.name && (
            <span className="text-primary font-medium">• {applicant.campus_id.name}</span>
          )}
        </div>
      </td>

      <td className="py-3 px-3">
        <p className="font-medium text-ink dark:text-white truncate max-w-[140px]">
          {applicant.qualification || '—'}
        </p>
        <span className="inline-block mt-0.5 text-[10px] text-ink-muted font-medium">
          {applicant.experience_years ? `${applicant.experience_years} Years Exp` : 'Fresh Candidate'}
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <p className="font-medium text-ink dark:text-white">{appliedDate}</p>
        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-surface-secondary dark:bg-white/10 text-ink-muted font-medium">
          {applicant.availability || 'Full Time'}
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <div className="space-y-0.5">
          <p className="text-[11px] text-ink-muted font-medium">
            Exp: <span className="font-bold text-ink dark:text-white">{applicant.expected_salary ? `PKR ${Number(applicant.expected_salary).toLocaleString()}` : '—'}</span>
          </p>
          <button
            type="button"
            onClick={() => onOpenSalary(applicant)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer block"
            title="Click to set/update approved salary"
          >
            Appr: {applicant.approved_salary ? `PKR ${Number(applicant.approved_salary).toLocaleString()}` : 'Set Salary'}
          </button>
        </div>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        {resumeHref ? (
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold text-[11px] transition-all shadow-2xs border border-primary/20"
          >
            <FileText className="w-3 h-3" />
            <span className="truncate max-w-[80px]">View CV</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ) : (
          <span className="text-[11px] text-ink-muted font-medium italic">No CV attached</span>
        )}
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
          {status}
        </span>
        {status === 'Converted' && applicant.converted_user_id && (
          <span className="block text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
            Active Staff
          </span>
        )}
      </td>

      <td className="py-3 px-3.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          {(status === 'Approved' || status === 'Verified') && (
            <button
              type="button"
              onClick={() => onOpenConvert(applicant)}
              title="1-Click Hire as Teacher"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all shadow-2xs cursor-pointer mr-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Hire</span>
            </button>
          )}

          {status === 'Pending Verification' && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Verified')}
                title="Mark as Verified / Interviewed"
                className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-blue-500 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Rejected')}
                title="Reject Candidate"
                className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-rose-500 transition-colors cursor-pointer"
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
                className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenSalary(applicant)}
                title="Approve & Set Agreed Salary"
                className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-emerald-500 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(applicant._id, 'Rejected')}
                title="Reject Candidate"
                className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-rose-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {status === 'Approved' && (
            <button
              type="button"
              onClick={() => onStatusChange(applicant._id, 'Verified')}
              title="Revert to Verified"
              className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          {status === 'Rejected' && (
            <button
              type="button"
              onClick={() => onStatusChange(applicant._id, 'Pending Verification')}
              title="Revert to Pending"
              className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted transition-colors cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onView(applicant)}
            title="View Full Candidate Profile"
            className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(applicant)}
            title="Edit Candidate"
            className="p-1.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-white/10 text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(applicant)}
            title="Delete Application"
            className="p-1.5 rounded-lg hover:bg-bad-soft dark:hover:bg-bad/10 text-bad transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApplicantTableRow;
