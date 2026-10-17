import { renderSvgBarcode, formatBpsGrade } from '../../../../utils/idCardCodeGenerator';

const TeacherServiceCardFront = ({ teacher, config = {}, style = 'GovtSindh' }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolLogo = school?.logo_url || userSchool?.school_logo || campus?.logo || '/logo.png';
  const schoolName = (school?.name || userSchool?.school_name || campus?.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const slogan = (school?.slogan || userSchool?.school_slogan || campus?.motto || 'Strive for Excellence').toUpperCase();

  const persId = teacher.personal_id || teacher.employee_code || '—';
  const cnicVal = teacher.cnic || '—';
  const barcodeVal = teacher.personal_id || teacher.employee_code || teacher._id?.slice(-8) || '00000000';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border border-emerald-700/40 shadow-sm overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[10px]">
      <div className="bg-emerald-800 text-white px-2.5 py-1 text-center flex items-center justify-between shrink-0 border-b border-black/10">
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={schoolLogo} alt="Emblem" className="w-4 h-4 object-contain" />
        </div>
        <div className="text-center leading-tight flex-1 px-1 min-w-0">
          <p className="font-black text-[9px] tracking-wide uppercase truncate">{schoolName}</p>
          <p className="font-bold text-[7.5px] opacity-90 tracking-wider truncate">{slogan}</p>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider bg-emerald-700 text-emerald-100">
          SERVICE CARD
        </span>
      </div>

      <div className="p-2 flex-1 flex gap-2 relative">
        <div className="w-[24mm] flex flex-col items-center justify-between shrink-0 z-10">
          <div className="w-[22mm] h-[25mm] rounded border border-gray-400 bg-gray-50 flex items-center justify-center overflow-hidden shadow-xs">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-xs text-gray-400">PHOTO</span>
            )}
          </div>
          <div className="w-full text-center mt-0.5">
            <div className="border-b border-gray-400 w-full mb-0.5" />
            <p className="text-[6px] font-bold text-gray-600 dark:text-gray-400 uppercase">Issuing Authority</p>
          </div>
          <div className="mt-0.5 text-black dark:text-white print:text-black">
            {renderSvgBarcode(barcodeVal, 65, 11)}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between z-10 min-w-0 pr-1 text-[8px]">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Name:</span>
              <span className="text-[9.5px] font-black uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 flex-1 leading-none">
                {teacher.name}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider shrink-0">S/o, D/o:</span>
              <span className="text-[8px] font-bold uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 flex-1 leading-none">
                {teacher.father_name || teacher.spouse_name || '—'}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-[6.5px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Designation:</span>
              <span className="text-[8px] font-black uppercase truncate border-b border-gray-300 dark:border-gray-700 pb-0.5 flex-1 leading-none text-emerald-800 dark:text-emerald-400 print:text-black">
                {teacher.designation || 'Staff'} {formatBpsGrade(teacher.bps_grade)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-[6.5px] font-bold text-gray-500 uppercase shrink-0">Pers #:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono text-[7.5px] font-bold">{persId}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[6.5px] font-bold text-gray-500 uppercase shrink-0">C.N.I.C:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono text-[7px] font-bold">{cnicVal}</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <p className="text-[6px] font-mono text-gray-500">ID: {teacher._id?.slice(-6)?.toUpperCase()}</p>
            <div className="flex items-center gap-0.5 text-[6.5px] font-semibold text-gray-400/80 dark:text-gray-500 select-none">
              <img src="/logo.png" alt="" className="w-2 h-2 object-contain opacity-60" />
              <span>EliteEdu</span>
            </div>
            <div className="text-right">
              <div className="border-b border-gray-400 w-16 mb-0.5" />
              <p className="text-[6px] font-bold text-gray-600 dark:text-gray-400 uppercase">Holder's Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherServiceCardFront;
