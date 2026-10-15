import { Award, ShieldCheck } from 'lucide-react';

const TeacherServiceCardFront = ({ teacher, config = {}, style = 'GovtSindh' }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  const isGovt = style === 'GovtSindh' || school?.school_type === 'Government';

  const headerTitle = isGovt
    ? 'EDUCATION & LITERACY DEPARTMENT'
    : (school.name || campus.name || 'ELITE EDUCATIONAL SYSTEM');
  const headerSubtitle = isGovt
    ? 'GOVERNMENT OF SINDH'
    : (campus.name || 'INSTITUTIONAL SERVICE CARD');

  const themeColors = {
    GovtSindh: { headerBg: 'bg-emerald-800 text-white', badge: 'bg-emerald-700 text-emerald-100', border: 'border-emerald-700/40' },
    Institutional: { headerBg: 'bg-slate-900 text-white', badge: 'bg-primary text-white', border: 'border-slate-300 dark:border-slate-700' },
    ModernMinimal: { headerBg: 'bg-teal-900 text-white', badge: 'bg-teal-700 text-teal-100', border: 'border-teal-500/30' }
  }[style] || { headerBg: 'bg-emerald-800 text-white', badge: 'bg-emerald-700 text-emerald-100', border: 'border-emerald-700/40' };

  return (
    <div className={`w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border ${themeColors.border} shadow-sm overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[10px]`}>
      <div className={`${themeColors.headerBg} px-2.5 py-1 text-center flex items-center justify-between shrink-0 border-b border-black/10`}>
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Emblem" className="w-4 h-4 object-contain" />
        </div>
        <div className="text-center leading-tight flex-1 px-1">
          <p className="font-black text-[9px] tracking-wide uppercase">{headerTitle}</p>
          <p className="font-bold text-[7.5px] opacity-90 tracking-wider">{headerSubtitle}</p>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${themeColors.badge}`}>
          SERVICE CARD
        </span>
      </div>

      <div className="p-2 flex-1 flex gap-2 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <img src="/logo.png" alt="Watermark" className="w-24 h-24 object-contain" />
        </div>

        <div className="w-[24mm] flex flex-col items-center justify-between shrink-0 z-10">
          <div className="w-[22mm] h-[26mm] rounded border border-gray-400 bg-gray-50 flex items-center justify-center overflow-hidden shadow-xs">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-xs text-gray-400">PHOTO</span>
            )}
          </div>
          <div className="w-full text-center mt-1">
            <div className="border-b border-gray-400 w-full mb-0.5" />
            <p className="text-[6.5px] font-bold text-gray-600 dark:text-gray-400 uppercase">Issuing Authority</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between z-10 min-w-0 pr-1">
          <div className="space-y-1">
            <div>
              <p className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider">Name</p>
              <p className="text-[10px] font-black uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 leading-none">
                {teacher.name}
              </p>
            </div>

            <div>
              <p className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider">S/o, D/o, W/o</p>
              <p className="text-[8.5px] font-bold uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 leading-none">
                {teacher.father_name || teacher.spouse_name || '—'}
              </p>
            </div>

            <div>
              <p className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider">Designation</p>
              <p className="text-[8.5px] font-black uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 leading-none text-emerald-800 dark:text-emerald-400 print:text-black">
                {teacher.designation || 'TEACHER'} {teacher.bps_grade ? `(BPS-${teacher.bps_grade})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-[6px] font-mono text-gray-500">EMP: {teacher.employee_code || teacher.personal_id || '—'}</p>
            </div>
            <div className="text-right">
              <div className="border-b border-gray-400 w-16 mb-0.5" />
              <p className="text-[6.5px] font-bold text-gray-600 dark:text-gray-400 uppercase">Holder's Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherServiceCardFront;
