import { X, User, Briefcase, MapPin, FileText, MessageSquare } from 'lucide-react';

const ApplicantDetailsModal = ({ isOpen, applicant, onClose }) => {
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface dark:bg-[#141414] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            {applicant.photo_url ? (
              <img src={applicant.photo_url} alt={applicant.name} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-base">
                {(applicant.name || 'A')[0]}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{applicant.name}</h2>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                {applicant.designation || 'Staff Applicant'} • {applicant.department || 'Academics'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1 border-b border-line/40 dark:border-white/5">
              <User className="w-3.5 h-3.5" />
              <span>Personal Information</span>
            </div>
            <div className="text-xs space-y-1 text-ink dark:text-ink-dark">
              <div><span className="text-ink-muted">Father Name:</span> {applicant.father_name || '—'}</div>
              <div><span className="text-ink-muted">Contact:</span> {applicant.contact_number || '—'}</div>
              <div><span className="text-ink-muted">Email:</span> {applicant.email || '—'}</div>
              <div><span className="text-ink-muted">CNIC:</span> {applicant.cnic || '—'}</div>
              <div><span className="text-ink-muted">Gender:</span> {applicant.gender || '—'}</div>
              <div><span className="text-ink-muted">Marital Status:</span> {applicant.marital_status || '—'}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1 border-b border-line/40 dark:border-white/5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Details</span>
            </div>
            <div className="text-xs space-y-1 text-ink dark:text-ink-dark">
              <div><span className="text-ink-muted">Department:</span> {applicant.department || '—'}</div>
              <div><span className="text-ink-muted">Designation:</span> {applicant.designation || '—'}</div>
              <div><span className="text-ink-muted">Qualification:</span> {applicant.qualification || '—'}</div>
              <div><span className="text-ink-muted">Experience:</span> {applicant.experience_years ? `${applicant.experience_years} Years` : '—'}</div>
              <div><span className="text-ink-muted">Availability:</span> {applicant.availability || '—'}</div>
              <div><span className="text-ink-muted">Expected Salary:</span> {applicant.expected_salary ? `Rs. ${applicant.expected_salary.toLocaleString()}` : '—'}</div>
              <div><span className="text-ink-muted">Approved Salary:</span> {applicant.approved_salary ? `Rs. ${applicant.approved_salary.toLocaleString()}` : '—'}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1 border-b border-line/40 dark:border-white/5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Address Details</span>
            </div>
            <div className="text-xs space-y-1 text-ink dark:text-ink-dark">
              <div><span className="text-ink-muted">Current:</span> {applicant.current_address || '—'}</div>
              <div><span className="text-ink-muted">Permanent:</span> {applicant.permanent_address || '—'}</div>
              <div><span className="text-ink-muted">City / Area:</span> {applicant.city ? `${applicant.city}, ${applicant.area || ''}` : '—'}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1 border-b border-line/40 dark:border-white/5">
              <FileText className="w-3.5 h-3.5" />
              <span>Resume & Documents</span>
            </div>
            <div className="text-xs space-y-1.5 text-ink dark:text-ink-dark">
              {applicant.resume_url ? (
                <a href={applicant.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold block">
                  View {applicant.resume_name || 'Uploaded Resume / CV'} →
                </a>
              ) : (
                <span className="text-ink-muted">No resume attached</span>
              )}
              {applicant.documents?.length > 0 && (
                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-semibold text-ink-muted block">Attached Documents:</span>
                  {applicant.documents.map((doc, idx) => (
                    <div key={idx} className="text-[11px] truncate">
                      • <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-ink dark:text-ink-dark hover:underline font-medium">{doc.title || `Doc #${idx + 1}`}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {applicant.follow_ups?.length > 0 && (
          <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs pb-1 border-b border-line/40 dark:border-white/5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Follow-ups & Notes ({applicant.follow_ups.length})</span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {applicant.follow_ups.map((f, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-surface dark:bg-black/20 border border-line/40 dark:border-white/5">
                  <div className="flex items-center justify-between text-[10px] text-ink-muted mb-0.5">
                    <span>{f.followed_up_by || 'Admin'}</span>
                    <span>{f.status || 'Note'}</span>
                  </div>
                  <p className="text-ink dark:text-ink-dark">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-secondary dark:bg-white/10 text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
