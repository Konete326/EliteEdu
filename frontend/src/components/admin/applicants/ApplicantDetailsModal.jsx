import {
  X,
  User,
  Briefcase,
  MapPin,
  FileText,
  MessageSquare,
  UserPlus,
  ExternalLink,
  GraduationCap,
  Calendar,
  CheckCircle2
} from 'lucide-react';

const STATUS_STYLES = {
  'Pending Verification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Verified': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Approved': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'Converted': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Rejected': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
};

const ApplicantDetailsModal = ({ isOpen, applicant, onClose, onConvert }) => {
  if (!isOpen || !applicant) return null;

  const status = applicant.status || 'Pending Verification';
  const statusBadge = STATUS_STYLES[status] || STATUS_STYLES['Pending Verification'];
  const resumeHref = applicant.resume_url || (applicant.documents?.length > 0 ? applicant.documents[0].file_url : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3.5">
            {applicant.photo_url ? (
              <img
                src={applicant.photo_url}
                alt={applicant.name}
                className="w-14 h-14 rounded-2xl object-cover border border-line dark:border-white/10 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg border border-primary/20">
                {(applicant.name || 'A').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-ink dark:text-white">{applicant.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                {applicant.designation || 'Staff Candidate'} • {applicant.department || 'Academics'}
                {applicant.campus_id?.name ? ` • ${applicant.campus_id.name}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {status !== 'Converted' && onConvert && (
              <button
                type="button"
                onClick={() => onConvert(applicant)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Hire as Teacher</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-line dark:border-white/10 text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1.5 border-b border-line/40 dark:border-white/5">
              <User className="w-3.5 h-3.5" />
              <span>Personal Profile</span>
            </div>
            <div className="text-xs space-y-1.5 text-ink dark:text-white">
              <div className="flex justify-between"><span className="text-ink-muted">Father / Guardian:</span> <span className="font-medium">{applicant.father_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Contact Phone:</span> <span className="font-mono font-medium">{applicant.contact_number || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Email Address:</span> <span className="font-medium">{applicant.email || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">CNIC No:</span> <span className="font-mono font-medium">{applicant.cnic || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Gender:</span> <span className="font-medium">{applicant.gender || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Marital Status:</span> <span className="font-medium">{applicant.marital_status || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Date of Birth:</span> <span className="font-medium">{applicant.dob ? new Date(applicant.dob).toLocaleDateString() : '—'}</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1.5 border-b border-line/40 dark:border-white/5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic &amp; Professional</span>
            </div>
            <div className="text-xs space-y-1.5 text-ink dark:text-white">
              <div className="flex justify-between"><span className="text-ink-muted">Degree / Qualification:</span> <span className="font-semibold">{applicant.qualification || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Experience:</span> <span className="font-medium">{applicant.experience_years ? `${applicant.experience_years} Years` : 'Fresh'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Target Department:</span> <span className="font-medium">{applicant.department || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Designation:</span> <span className="font-medium">{applicant.designation || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Work Availability:</span> <span className="font-medium">{applicant.availability || 'Full Time'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Expected Salary:</span> <span className="font-mono font-bold text-ink dark:text-white">{applicant.expected_salary ? `PKR ${Number(applicant.expected_salary).toLocaleString()}` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Approved Salary:</span> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{applicant.approved_salary ? `PKR ${Number(applicant.approved_salary).toLocaleString()}` : 'Pending Agreement'}</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1.5 border-b border-line/40 dark:border-white/5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Address &amp; Location</span>
            </div>
            <div className="text-xs space-y-1.5 text-ink dark:text-white">
              <div><span className="text-ink-muted block text-[11px]">Current Address:</span> <span className="font-medium">{applicant.current_address || '—'}</span></div>
              <div><span className="text-ink-muted block text-[11px]">Permanent Address:</span> <span className="font-medium">{applicant.permanent_address || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">City / Town:</span> <span className="font-medium">{applicant.city || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Area / Sector:</span> <span className="font-medium">{applicant.area || '—'}</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1.5 border-b border-line/40 dark:border-white/5">
              <FileText className="w-3.5 h-3.5" />
              <span>Resume &amp; Attached Files</span>
            </div>
            <div className="text-xs space-y-2 text-ink dark:text-white">
              {resumeHref ? (
                <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold truncate">{applicant.resume_name || 'Candidate CV / Resume'}</span>
                  </div>
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
                  >
                    <span>View / Download</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-ink-muted italic py-1">No resume document uploaded.</p>
              )}

              {applicant.documents?.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-ink-muted block">Other Verified Documents:</span>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {applicant.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-1.5 rounded-lg bg-surface dark:bg-black/20 hover:bg-surface-secondary text-[11px] text-ink dark:text-white transition-colors"
                      >
                        <span className="truncate">{doc.title || `Document ${idx + 1}`}</span>
                        <ExternalLink className="w-3 h-3 text-ink-muted shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {applicant.follow_ups?.length > 0 && (
          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1.5 border-b border-line/40 dark:border-white/5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interview Notes &amp; Follow-up History ({applicant.follow_ups.length})</span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {applicant.follow_ups.map((f, i) => (
                <div key={i} className="text-xs p-2.5 rounded-lg bg-surface dark:bg-[#161616] border border-line/40 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-ink-muted">
                    <span className="font-semibold">{f.followed_up_by || 'HR Evaluator'}</span>
                    <span className="font-medium">{f.created_at ? new Date(f.created_at).toLocaleDateString() : '—'}</span>
                  </div>
                  <p className="text-ink dark:text-white leading-relaxed">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-line dark:border-white/10">
          <p className="text-[11px] text-ink-muted">
            Added on {applicant.added_on ? new Date(applicant.added_on).toLocaleDateString() : '—'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-secondary dark:bg-white/10 text-xs font-bold text-ink dark:text-white hover:bg-surface-secondary/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
