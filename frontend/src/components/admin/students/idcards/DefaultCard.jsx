import { GraduationCap } from 'lucide-react';
import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const DefaultCard = ({ student, config = {} }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const campusName = campus.name || school.name || 'CAMPUS APWA GBSS J-1';
  const area = campus.area ? `AREA ${campus.area.toUpperCase()} SEMIS` : 'AREA KORANGI SEMIS';
  const semis = campus.semis_code || '408110114';
  const motto = config.motto || 'پڑھے گا سندھ بڑھے گا سندھ';
  const grNumber = student?.gr_number || '0000';
  const className = `${student?.current_grade?.name || 'Grade-1'}${student?.current_section ? ` (${student.current_section})` : ''}`;
  const doa = student?.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const verifyUrl = generateStudentVerifyUrl(student?._id);

  return (
    <div className="w-full bg-white dark:bg-[#0e0e12] text-black dark:text-white border-2 border-line dark:border-white/20 rounded-xl p-2.5 flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white print:shadow-none overflow-hidden h-[340px] sm:h-[350px]">
      <div className="text-center space-y-0.5 border-b border-black/10 dark:border-white/10 pb-1.5">
        <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] print:border print:border-black">
          🎓
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-1">{campusName}</h4>
        <p className="text-[8px] font-bold text-ink-muted uppercase leading-tight">{area}</p>
        <p className="text-[8px] font-mono font-bold leading-tight">{semis}</p>
        {config.showMotto !== false && (
          <p className="text-[9px] font-bold text-primary dark:text-primary-dark font-urdu leading-tight pt-0.5 print:text-black">
            {motto}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center py-1">
        <div className="w-16 h-18 rounded-lg border-2 border-black/15 dark:border-white/20 overflow-hidden bg-surface-secondary flex items-center justify-center font-bold text-sm shadow-xs print:border-black">
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
          ) : initials}
        </div>
        {config.showBarcode !== false && (
          <div className="mt-1 flex justify-center text-black dark:text-white print:text-black">
            {renderSvgBarcode(grNumber, 85, 18)}
          </div>
        )}
        <h3 className="text-xs font-black uppercase text-center mt-1 leading-tight line-clamp-1 tracking-tight">
          {student?.name || 'STUDENT NAME'}
        </h3>
        <div className="mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-black text-white text-[8px] font-black uppercase tracking-wider print:bg-black print:text-white">
          <GraduationCap className="w-2.5 h-2.5" /> STUDENT
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 pt-1 border-t border-black/10 dark:border-white/10 text-[9px] font-bold">
        <div className="space-y-0.5 min-w-0">
          <p className="truncate"><span className="text-ink-muted font-normal">ID →</span> {grNumber}</p>
          <p className="truncate"><span className="text-ink-muted font-normal">Class →</span> {className}</p>
          <p className="truncate"><span className="text-ink-muted font-normal">DOA →</span> {doa}</p>
          {config.showBloodGroup && student?.blood_group && (
            <p className="text-red-600 dark:text-red-400 truncate"><span className="text-ink-muted font-normal">Blood:</span> {student.blood_group}</p>
          )}
        </div>
        {config.showQr !== false && (
          <a
            href={verifyUrl}
            target="_blank"
            rel="noreferrer"
            title="Scan or click to verify"
            className="shrink-0 p-0.5 bg-white border border-black/10 rounded hover:scale-105 transition-transform cursor-pointer"
          >
            {renderSvgQrCode(verifyUrl, 44)}
          </a>
        )}
      </div>
    </div>
  );
};

export default DefaultCard;
