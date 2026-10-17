import { GraduationCap } from 'lucide-react';
import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const Style1Card = ({ student, config = {} }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const campusName = school.name || campus.name || 'INSTITUTION';
  const logo = school.logo_url || campus.logo;
  const grNumber = student?.gr_number || '—';
  const rawGrade = student?.current_grade?.name || 'Grade';
  const cleanGrade = rawGrade.replace(/^class\s*/i, '');
  const className = `${cleanGrade}${student?.current_section ? `-${student.current_section}` : ''}`;
  const doa = student?.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const verifyUrl = generateStudentVerifyUrl(student);
  const accentColor = config.accentColor || '#3b82f6';

  return (
    <div className="w-full bg-white dark:bg-[#0e0e12] text-black dark:text-white border border-line dark:border-white/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white print:shadow-none h-[340px] sm:h-[350px] relative">
      <div style={{ backgroundColor: accentColor }} className="p-2 text-white text-center relative print:bg-black print:text-white flex items-center justify-center gap-1.5 z-10">
        {logo && (
          <div className="w-5 h-5 rounded-full bg-white/20 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-[10.5px] font-black uppercase tracking-wide truncate">{campusName}</h4>
          <p className="text-[7.5px] opacity-90 uppercase font-bold">Student Identity Pass</p>
        </div>
      </div>

      <div className="flex flex-col items-center px-3 pt-2 relative z-10">
        <div
          style={{ borderColor: accentColor }}
          className="w-18 h-18 rounded-full border-2 p-0.5 bg-surface overflow-hidden shadow-xs shrink-0 flex items-center justify-center font-bold text-sm"
        >
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full rounded-full object-cover" />
          ) : initials}
        </div>
        <h3 className="text-xs font-black uppercase text-center mt-1.5 line-clamp-1">{student?.name || 'STUDENT NAME'}</h3>
        <span className="text-[9px] text-ink-muted font-bold truncate">S/O {student?.father_name || '—'}</span>
        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase">
          <GraduationCap className="w-2.5 h-2.5" /> STUDENT
        </div>
      </div>

      <div className="px-3 py-1 grid grid-cols-2 gap-1.5 text-[9px] bg-surface-secondary/40 dark:bg-white/5 rounded-xl mx-2.5 my-1 relative z-10">
        <div><span className="text-ink-muted block text-[8px]">REG / GR #</span><span className="font-bold">{grNumber}</span></div>
        <div><span className="text-ink-muted block text-[8px]">CLASS</span><span className="font-bold">{className}</span></div>
        <div><span className="text-ink-muted block text-[8px]">ADMISSION</span><span className="font-bold">{doa}</span></div>
        <div>
          <span className="text-ink-muted block text-[8px]">BLOOD GROUP</span>
          <span className="font-bold text-red-600 dark:text-red-400">{student?.blood_group || '—'}</span>
        </div>
      </div>

      <div className="p-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-1 text-black dark:text-white print:text-black relative z-10">
        {config.showBarcode !== false && renderSvgBarcode(grNumber, 70, 16)}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-[7px] text-ink-muted/80 font-semibold select-none">
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

export default Style1Card;
