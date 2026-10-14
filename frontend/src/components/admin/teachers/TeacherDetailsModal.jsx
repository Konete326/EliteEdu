import { X, UserCheck, Calendar, BookOpen, CreditCard } from 'lucide-react';

const TeacherDetailsModal = ({ isOpen, teacher, onClose }) => {
  if (!isOpen || !teacher) return null;

  const initials = teacher.name
    ? teacher.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TC';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-ink dark:text-ink-dark">{teacher.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  teacher.status === 'Active' ? 'bg-good-soft text-good dark:bg-good/20' : 'bg-bad-soft text-bad dark:bg-bad/20'
                }`}>
                  {teacher.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
                {teacher.designation || 'Staff'} • {teacher.bps_grade || 'BPS'} • {teacher.employee_code || 'No Code'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-2">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <UserCheck className="w-3.5 h-3.5" /> Identity & Contact
            </h4>
            <div className="space-y-1 text-ink-sub dark:text-ink-sub-dark">
              <p><span className="text-ink-muted">Father/Spouse:</span> {teacher.father_name || teacher.spouse_name || 'N/A'}</p>
              <p><span className="text-ink-muted">CNIC:</span> {teacher.cnic || 'N/A'}</p>
              <p><span className="text-ink-muted">Gender:</span> {teacher.gender || 'N/A'} • <span className="text-ink-muted">DOB:</span> {teacher.dob ? new Date(teacher.dob).toLocaleDateString() : 'N/A'}</p>
              <p><span className="text-ink-muted">Email:</span> {teacher.email}</p>
              <p><span className="text-ink-muted">Phone:</span> {teacher.contact_number || teacher.whatsapp_number || 'N/A'}</p>
              <p><span className="text-ink-muted">Address:</span> {teacher.current_address || teacher.address || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-2">
            <h4 className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5 uppercase text-primary">
              <Calendar className="w-3.5 h-3.5" /> Service & Appointment
            </h4>
            <div className="space-y-1 text-ink-sub dark:text-ink-sub-dark">
              <p><span className="text-ink-muted">Emp Code:</span> {teacher.employee_code || 'N/A'}</p>
              <p><span className="text-ink-muted">Personal ID:</span> {teacher.personal_id || 'N/A'}</p>
              <p><span className="text-ink-muted">Order No:</span> {teacher.appointment_order_no || 'N/A'}</p>
              <p><span className="text-ink-muted">Joining:</span> {teacher.joining_date ? new Date(teacher.joining_date).toLocaleDateString() : 'N/A'}</p>
              <p><span className="text-ink-muted">Campus:</span> {teacher.campus_id?.name || 'Main School'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase text-ink dark:text-ink-dark flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Assigned Subjects & Classes
          </h4>
          <div className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-2 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {teacher.subjects?.length > 0 ? (
                teacher.subjects.map((s) => (
                  <span key={s._id} className="px-2.5 py-0.5 rounded-full font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
                    {s.name} ({s.code || 'SUB'})
                  </span>
                ))
              ) : <span className="text-ink-muted">No subjects assigned</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {teacher.grades?.length > 0 ? (
                teacher.grades.map((g) => (
                  <span key={g._id} className="px-2.5 py-0.5 rounded-full font-semibold bg-ink text-white dark:bg-[#222222]">
                    {g.name}
                  </span>
                ))
              ) : <span className="text-ink-muted">No grades assigned</span>}
            </div>
          </div>
        </div>

        {teacher.bank_details?.bank_name && (
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 text-xs flex items-center justify-between">
            <div>
              <p className="text-ink-muted">Bank: {teacher.bank_details.bank_name}</p>
              <p className="font-semibold text-ink dark:text-ink-dark">{teacher.bank_details.account_title || 'N/A'}</p>
            </div>
            <p className="font-mono text-xs">{teacher.bank_details.iban || teacher.bank_details.account_number || 'N/A'}</p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
