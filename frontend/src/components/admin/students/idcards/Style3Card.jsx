import { GraduationCap } from 'lucide-react';
import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const Style3Card = ({ student, config = {} }) => {
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

  return (
    <div className="w-full bg-white dark:bg-[#0c0c0f] text-black dark:text-white border-2 border-line dark:border-white/20 rounded-xl p-2.5 flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white h-[340px] sm:h-[350px] relative">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-1.5 relative z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center font-bold text-[9px] overflow-hidden shrink-0">
            {logo ? <img src={logo} alt="" className="w-full h-full object-contain" /> : <GraduationCap className="w-3 h-3" />}
          </div>
          <h4 className="text-[10px] font-black uppercase truncate">{campusName}</h4>
        </div>
        <span className="text-[8px] font-mono font-bold px-1 rounded bg-black/5 dark:bg-white/10 shrink-0">ID CARD</span>
      </div>

      <div className="flex items-start gap-2 py-2 relative z-10">
        <div className="space-y-1.5 shrink-0 flex flex-col items-center">
          <div className="w-16 h-20 rounded-lg border border-black/20 dark:border-white/20 overflow-hidden bg-surface-secondary flex items-center justify-center font-bold text-sm shadow-2xs">
            {student?.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          {config.showBarcode !== false && (
            <div className="text-black dark:text-white print:text-black">
              {renderSvgBarcode(grNumber, 65, 14)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1 text-[9px]">
          <h3 className="font-black text-xs uppercase leading-tight truncate">{student?.name || 'STUDENT'}</h3>
          <p className="text-ink-muted text-[8px] truncate">S/O {student?.father_name || '—'}</p>
          <div className="pt-1 space-y-0.5 font-bold">
            <p className="truncate"><span className="text-ink-muted font-normal">GR #:</span> {grNumber}</p>
            <p className="truncate"><span className="text-ink-muted font-normal">Grade:</span> {className}</p>
            <p className="truncate"><span className="text-ink-muted font-normal">DOA:</span> {doa}</p>
            {student?.blood_group && (
              <p className="text-red-600 dark:text-red-400 truncate"><span className="text-ink-muted font-normal">Blood:</span> {student.blood_group}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between relative z-10">
        <span className="text-[8px] font-bold text-ink-muted uppercase">Authorized Pass</span>
        <div className="flex items-center gap-2">
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

export default Style3Card;
