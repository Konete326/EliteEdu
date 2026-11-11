import {
  Check,
  CheckCircle2,
  X,
  UserPlus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ExternalLink,
  Phone,
  Briefcase
} from 'lucide-react';

const STATUS_STYLES = {
  'Pending Verification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Verified': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Approved': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'Converted': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Rejected': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
};

const ApplicantMobileCard = ({
  applicant,
  onStatusChange,
  onOpenConvert,
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
  const isConverted = status === 'Converted' || Boolean(applicant.converted_teacher_id);

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {applicant.photo_url ? (
            <img
              src={applicant.photo_url}
              alt={applicant.name}
              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-line dark:border-line-dark shadow-xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm text-ink dark:text-white truncate">{applicant.name}</h4>
            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              {applicant.contact_number && (
                <span className="flex items-center gap-1 font-mono">
                  <Phone size={10} /> {applicant.contact_number}
                </span>
              )}
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border shrink-0 ${statusBadgeClass}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-secondary/40 p-2.5 rounded-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Position</span>
          <span className="font-semibold text-ink dark:text-white truncate block">
            {applicant.applied_position || 'Staff'} • {applicant.department || 'General'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Qualification</span>
          <span className="font-semibold text-ink dark:text-white truncate block">
            {applicant.highest_qualification || 'Degree'} ({applicant.experience_years || 0}y exp)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
        <span>Applied: <strong className="text-ink dark:text-white font-medium">{appliedDate}</strong></span>
        {resumeHref && (
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <FileText size={12} /> View CV
          </a>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line/60 dark:border-line-dark/60 gap-1.5 flex-wrap">
        {!isConverted && (
          <div className="flex items-center gap-1">
            {status !== 'Approved' && (
              <button
                type="button"
                onClick={() => onStatusChange && onStatusChange(applicant._id, 'Approved')}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center gap-1 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="Approve Candidate"
              >
                <Check size={14} /> Approve
              </button>
            )}
            {status !== 'Rejected' && (
              <button
                type="button"
                onClick={() => onStatusChange && onStatusChange(applicant._id, 'Rejected')}
                className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs flex items-center gap-1 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Reject Candidate"
              >
                <X size={14} /> Reject
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenConvert && onOpenConvert(applicant)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1 hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
              title="Hire & Convert to Teacher"
            >
              <UserPlus size={14} /> Hire
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => onView && onView(applicant)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(applicant)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(applicant)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantMobileCard;

