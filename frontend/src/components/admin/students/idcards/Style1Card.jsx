import { GraduationCap } from 'lucide-react';
import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const Style1Card = ({ student, config = {} }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const campusName = campus.name || school.name || 'APWA GBSS J-1';
  const grNumber = student?.gr_number || '0000';
  const className = `${student?.current_grade?.name || 'Class'}${student?.current_section ? `-${student.current_section}` : ''}`;
  const doa = student?.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const verifyUrl = generateStudentVerifyUrl(student?._id);
  const accentColor = config.accentColor || '#3b82f6';

  return (
    <div className="w-full bg-white dark:bg-[#0e0e12] text-black dark:text-white border border-line dark:border-white/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white print:shadow-none h-[340px] sm:h-[350px]">
      <div style={{ backgroundColor: accentColor }} className="p-2.5 text-white text-center relative print:bg-black print:text-white">
        <h4 className="text-[11px] font-black uppercase tracking-wide truncate">{campusName}</h4>
        <p className="text-[8px] opacity-90 uppercase font-bold">Student Identity Pass</p>
      </div>

      <div className="flex flex-col items-center px-3 pt-2">
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

      <div className="px-3 py-1 grid grid-cols-2 gap-1.5 text-[9px] bg-surface-secondary/40 dark:bg-white/5 rounded-xl mx-2.5 my-1">
        <div><span className="text-ink-muted block text-[8px]">REG / GR #</span><span className="font-bold">{grNumber}</span></div>
        <div><span className="text-ink-muted block text-[8px]">CLASS</span><span className="font-bold">{className}</span></div>
        <div><span className="text-ink-muted block text-[8px]">ADMISSION</span><span className="font-bold">{doa}</span></div>
        <div>
          <span className="text-ink-muted block text-[8px]">BLOOD GROUP</span>
          <span className="font-bold text-red-600 dark:text-red-400">{student?.blood_group || 'N/A'}</span>
        </div>
      </div>

      <div className="p-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-1 text-black dark:text-white print:text-black">
        {config.showBarcode !== false && renderSvgBarcode(grNumber, 75, 18)}
        {config.showQr !== false && (
          <a href={verifyUrl} target="_blank" rel="noreferrer" title="Click to verify">
            {renderSvgQrCode(verifyUrl, 38)}
          </a>
        )}
      </div>
    </div>
  );
};

export default Style1Card;
