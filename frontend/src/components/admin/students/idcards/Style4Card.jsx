import { GraduationCap } from 'lucide-react';
import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const Style4Card = ({ student, config = {} }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const campusName = school.name || campus.name || 'INSTITUTION';
  const logo = school.logo_url || campus.logo;
  const grNumber = student?.gr_number || '—';
  const rawGrade = student?.current_grade?.name || 'Grade';
  const cleanGrade = rawGrade.replace(/^class\s*/i, '');
  const className = `${cleanGrade}${student?.current_section ? ` (${student.current_section})` : ''}`;
  const doa = student?.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const verifyUrl = generateStudentVerifyUrl(student);

  return (
    <div className="w-full bg-white dark:bg-[#0c0c0f] text-black dark:text-white border-2 border-primary/40 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white h-[340px] sm:h-[350px] relative">
      <div className="flex flex-col items-center border-b border-black/10 dark:border-white/10 pb-1.5 relative z-10">
        {logo ? (
          <img src={logo} alt="" className="w-6 h-6 object-contain mb-0.5 rounded-full" />
        ) : (
          <div className="w-8 h-1.5 rounded-full bg-black/20 dark:bg-white/30 mb-1" />
        )}
        <h4 className="text-[10px] font-black uppercase tracking-tight text-center truncate w-full">{campusName}</h4>
        <span className="text-[7.5px] font-bold text-primary dark:text-primary-dark uppercase">Student Smart Card</span>
      </div>

      <div className="flex flex-col items-center py-1 relative z-10">
        <div className="w-16 h-18 rounded-xl border-2 border-primary/30 overflow-hidden bg-surface-secondary flex items-center justify-center font-bold text-sm shadow-xs print:border-black">
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <h3 className="text-xs font-black uppercase text-center mt-1.5 line-clamp-1">{student?.name || 'STUDENT'}</h3>
        <p className="text-[8px] text-ink-muted font-bold truncate">S/O {student?.father_name || '—'}</p>
        <div className="mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-primary text-white text-[7.5px] font-black uppercase">
          <GraduationCap className="w-2 h-2" /> STUDENT
        </div>
      </div>

      <div className="space-y-1 text-[8.5px] font-bold px-1 relative z-10">
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-0.5">
          <span className="text-ink-muted font-normal">GR #</span><span>{grNumber}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-0.5">
          <span className="text-ink-muted font-normal">Class</span><span>{className}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted font-normal">DOA</span><span>{doa}</span>
        </div>
      </div>

      <div className="pt-1 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-1 text-black dark:text-white print:text-black relative z-10">
        {config.showBarcode !== false && renderSvgBarcode(grNumber, 65, 16)}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-[7px] font-bold text-ink-muted/80 select-none">
            <img src="/logo.png" alt="" className="w-2.5 h-2.5 object-contain opacity-60" />
            <span>EliteEdu</span>
          </div>
          {config.showQr !== false && (
            <a href={verifyUrl} target="_blank" rel="noreferrer" title="Click to verify">
              {renderSvgQrCode(verifyUrl, 34)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Style4Card;
