import { X, UserCheck, BookOpen, Home, CreditCard, Users, FileText, ExternalLink } from 'lucide-react';

const StudentDetailsModal = ({ isOpen, student, onClose }) => {
  if (!isOpen || !student) return null;
  const initials = student.name ? student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center shadow-md overflow-hidden">
              {student.photo_url ? <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" /> : initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-ink dark:text-ink-dark">{student.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-good-soft text-good dark:bg-good/20' : 'bg-bad-soft text-bad dark:bg-bad/20'}`}>
                  {student.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
                GR: {student.gr_number} • S/O {student.father_name} • {student.current_grade?.name || 'Class N/A'} - {student.current_section || 'A'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1.5">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <UserCheck className="w-3.5 h-3.5" /> Identity & Placement
            </h4>
            <p><span className="text-ink-muted">GR Number:</span> {student.gr_number}</p>
            <p><span className="text-ink-muted">Gender:</span> {student.gender || 'N/A'} • <span className="text-ink-muted">B-Form:</span> {student.b_form || 'N/A'}</p>
            <p><span className="text-ink-muted">Date of Birth:</span> {student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
            <p><span className="text-ink-muted">Current Class:</span> {student.current_grade?.name || 'N/A'} ({student.current_section || 'N/A'})</p>
            <p><span className="text-ink-muted">Campus:</span> {student.campus_id?.name || 'Main Campus'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1.5">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <Users className="w-3.5 h-3.5" /> Family & Guardians
            </h4>
            <p><span className="text-ink-muted">Father:</span> {student.father_name} ({student.parents_cnic?.father_cnic || 'No CNIC'})</p>
            <p><span className="text-ink-muted">Mother/Guardian:</span> {student.mother_guardian_name || 'N/A'}</p>
            <p><span className="text-ink-muted">Emergency:</span> {student.emergency_contact_no || 'N/A'}</p>
            <p><span className="text-ink-muted">Primary Phone:</span> {student.contact_number || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1.5">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <CreditCard className="w-3.5 h-3.5" /> Fee & Financials
            </h4>
            <p><span className="text-ink-muted">Monthly Fee:</span> Rs. {Number(student.monthly_fee || 0).toLocaleString()}</p>
            <p><span className="text-ink-muted">Concession:</span> Rs. {Number(student.discount || 0).toLocaleString()}</p>
            <p><span className="text-ink-muted">Net Monthly:</span> Rs. {Math.max(0, Number(student.monthly_fee || 0) - Number(student.discount || 0)).toLocaleString()}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1.5">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <Home className="w-3.5 h-3.5" /> Address
            </h4>
            <p><span className="text-ink-muted">Current:</span> {student.address?.current_address || 'N/A'}</p>
            <p><span className="text-ink-muted">Permanent:</span> {student.address?.permanent_address || 'N/A'}</p>
          </div>
        </div>

        {student.documents?.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold uppercase text-ink dark:text-ink-dark flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Attached Documents ({student.documents.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {student.documents.map((d, i) => (
                <a key={i} href={d.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary bg-surface-secondary/40 text-primary font-semibold">
                  <ExternalLink className="w-3 h-3" /> {d.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary text-ink dark:text-ink-dark">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
