import { Globe, Smartphone } from 'lucide-react';
import { renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const AdmissionRegistrationStrip = ({ student }) => {
  const dobStr = student?.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const admDateStr = student?.admission_date ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const address = student?.address?.current_address || 'Sherabad Landhi, Karachi';
  const verifyUrl = student ? generateStudentVerifyUrl(student) : 'https://elitedev-edu.vercel.app';

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-2.5 border-b border-line dark:border-white/10 items-center">
      <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs">
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Serial No</span>
          <p className="font-bold font-mono text-ink dark:text-ink-dark">{student?.serial_no || '2,017,293'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Registration / GR No</span>
          <p className="font-black font-mono text-primary dark:text-primary-dark">{student?.gr_number}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Date of Admission</span>
          <p className="font-bold text-ink dark:text-ink-dark">{admDateStr}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Student Name</span>
          <p className="font-bold text-ink dark:text-ink-dark">{student?.name}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Date of Birth</span>
          <p className="font-bold text-ink dark:text-ink-dark">{dobStr}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Class & Section</span>
          <p className="font-bold text-ink dark:text-ink-dark">{student?.current_grade?.name || 'Class'} - {student?.current_section || 'A'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Birth Form ID / CNIC</span>
          <p className="font-bold font-mono text-ink dark:text-ink-dark">{student?.b_form || '—'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Gender</span>
          <p className="font-bold text-ink dark:text-ink-dark capitalize">{student?.gender || 'Male'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Emergency Contact</span>
          <p className="font-mono font-bold text-ink dark:text-ink-dark">{student?.contact_number || student?.emergency_contact_no || '—'}</p>
        </div>
        <div className="col-span-2 sm:col-span-3 pt-0.5">
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Residential Address</span>
          <p className="font-medium text-ink dark:text-ink-dark truncate">{address}</p>
        </div>
      </div>

      <div className="md:col-span-3 flex flex-col items-center justify-center p-2.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/20 dark:bg-[#121217] text-center">
        <div className="w-18 h-18 bg-white p-1 rounded-lg border border-black/10 shadow-xs flex items-center justify-center overflow-hidden">
          {renderSvgQrCode(verifyUrl, 68)}
        </div>
        <span className="block text-[8.5px] font-black uppercase text-ink dark:text-ink-dark mt-1.5 tracking-tight">
          Scan QR To Verify
        </span>
        <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] font-semibold text-ink-muted">
          <span className="inline-flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> Portal</span>
          <span>•</span>
          <span className="inline-flex items-center gap-0.5"><Smartphone className="w-2.5 h-2.5" /> Mobile</span>
        </div>
      </div>
    </div>
  );
};

export default AdmissionRegistrationStrip;
