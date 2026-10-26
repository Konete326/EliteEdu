import { GraduationCap, User } from 'lucide-react';
import { QRCode } from '@/components/ui/qr-code';

const ReportCardHeaderStrip = ({ student = {}, header = {} }) => {
  const verifyUrl = student._id ? `${window.location.origin}/verify/student/${student._id}` : '';

  return (
    <div className="space-y-4 pb-4 border-b-2 border-primary/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {header.logoUrl ? (
            <img src={header.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <GraduationCap size={32} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-black uppercase text-ink tracking-tight">
              {header.schoolName || 'Elite Educational System'}
            </h1>
            <p className="text-xs font-semibold text-primary">
              {header.slogan || 'Excellence in Education'}
            </p>
            <p className="text-[11px] text-ink-muted">
              {header.campusName || 'Main Campus'} {header.campusPhone ? `• Ph: ${header.campusPhone}` : ''}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary text-white shadow-xs">
            STUDENT PROGRESS REPORT CARD
          </span>
          <p className="text-[11px] font-bold text-ink mt-1">
            Session: {student.academic_session || '2026-2027'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 p-3 rounded-2xl bg-surface-secondary/50 border border-line items-center">
        <div className="col-span-2 flex justify-center">
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-20 h-20 rounded-xl object-cover border border-line shadow-2xs" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-surface border border-line flex items-center justify-center text-ink-muted">
              <User size={36} />
            </div>
          )}
        </div>

        <div className="col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">Student Name</span><span className="font-black text-ink">{student.name || '—'}</span></div>
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">Father Name</span><span className="font-semibold text-ink">{student.father_name || '—'}</span></div>
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">GR Number</span><span className="font-mono font-bold text-primary">{student.gr_number || '—'}</span></div>
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">Class & Section</span><span className="font-bold text-ink">{student.current_grade?.name || 'Class'} - {student.current_section || 'A'}</span></div>
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">Date of Birth</span><span className="font-medium text-ink">{student.dob ? new Date(student.dob).toLocaleDateString() : '—'} ({student.age || '—'})</span></div>
          <div><span className="text-[10px] text-ink-muted block uppercase font-bold">Gender</span><span className="font-medium text-ink">{student.gender || '—'}</span></div>
        </div>

        <div className="col-span-2 flex flex-col items-center justify-center">
          {verifyUrl && (
            <>
              <div className="p-1 bg-white rounded border border-line shadow-2xs">
                <QRCode
                  value={verifyUrl}
                  size={58}
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                />
              </div>
              <span className="text-[9px] text-ink-muted mt-1 uppercase font-bold tracking-widest">Verify Record</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCardHeaderStrip;
