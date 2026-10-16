import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const Style2Card = ({ student, config = {} }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const campusName = school.name || campus.name || 'ELITE EDUCATIONAL SYSTEM';
  const logo = school.logo_url || campus.logo;
  const grNumber = student?.gr_number || '0000';
  const rawGrade = student?.current_grade?.name || '1';
  const cleanGrade = rawGrade.replace(/^class\s*/i, '');
  const className = `${cleanGrade}${student?.current_section ? ` (${student.current_section})` : ''}`;
  const doa = student?.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const verifyUrl = generateStudentVerifyUrl(student);

  return (
    <div className="w-full bg-white dark:bg-[#0c0c0f] text-black dark:text-white border-2 border-black dark:border-white/30 rounded-lg p-3 flex flex-col justify-between shadow-xs select-none print:border-black print:text-black print:bg-white h-[340px] sm:h-[350px] relative">
      <div className="border-b-2 border-black dark:border-white/20 pb-2 flex items-start justify-between gap-1 print:border-black relative z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          {logo && (
            <div className="w-6 h-6 rounded border border-black/20 dark:border-white/20 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-[10px] font-black uppercase tracking-tight truncate">{campusName}</h4>
            <span className="text-[8px] font-mono uppercase text-ink-muted">ACADEMIC CARD</span>
          </div>
        </div>
        {student?.blood_group && (
          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-black shrink-0">
            {student.blood_group}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 py-2 relative z-10">
        <div className="w-16 h-20 rounded border border-black/30 dark:border-white/30 bg-surface-secondary overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm">
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <div className="min-w-0 flex-1 space-y-0.5 text-[9px]">
          <h3 className="font-black text-xs uppercase leading-tight truncate">{student?.name || 'STUDENT'}</h3>
          <p className="text-ink-muted text-[8px] truncate">F/N: {student?.father_name || '—'}</p>
          <div className="pt-1 space-y-0.5 font-bold">
            <p className="truncate"><span className="text-ink-muted font-normal">GR #:</span> {grNumber}</p>
            <p className="truncate"><span className="text-ink-muted font-normal">CLASS:</span> {className}</p>
            <p className="truncate"><span className="text-ink-muted font-normal">VALID:</span> {doa}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t-2 border-black dark:border-white/20 flex items-center justify-between gap-2 print:border-black relative z-10">
        <div className="space-y-1 text-black dark:text-white print:text-black">
          {config.showBarcode !== false && renderSvgBarcode(grNumber, 75, 18)}
          <span className="text-[7px] font-mono block tracking-widest">*{grNumber}*</span>
        </div>
        <div className="flex items-center gap-1.5">
          {config.showQr !== false && (
            <a href={verifyUrl} target="_blank" rel="noreferrer" title="Verify student">
              {renderSvgQrCode(verifyUrl, 38)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Style2Card;
