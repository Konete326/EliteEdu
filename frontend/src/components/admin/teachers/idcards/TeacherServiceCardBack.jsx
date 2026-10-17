import { renderSvgQrCode, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator';
import TeacherIdBackBoxes from './TeacherIdBackBoxes';

const TeacherServiceCardBack = ({ teacher, config = {}, style = 'GovtSindh' }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  const schoolLogo = school?.logo_url || campus?.logo || '/logo.png';
  const verifyUrl = generateStaffVerifyUrl(teacher);

  const bannerColor = style === 'Institutional' ? 'bg-slate-900 text-white' : 'bg-emerald-800 text-white';
  const dobStr = teacher?.dob ? new Date(teacher.dob).toLocaleDateString('en-GB').replace(/\//g, '-') : '—';
  const apptDateStr = teacher?.appointment_date || teacher?.joining_date
    ? new Date(teacher.appointment_date || teacher.joining_date).toLocaleDateString('en-GB').replace(/\//g, '-')
    : '—';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[7.5px] leading-tight relative">
      <div className="p-2 space-y-1 flex-1 relative z-10">
        <TeacherIdBackBoxes cnic={teacher?.cnic} personalId={teacher?.personal_id || teacher?.employee_code} dob={dobStr} />

        <div className="flex gap-2 pt-0.5">
          <div className="flex-1 space-y-0.5 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Date of Appt:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-semibold">{apptDateStr}</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Place of Posting:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-semibold">{campus.name || school.name || '—'}</span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">SEMIS Code:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono">{teacher.semis_code || campus.semis_code || '—'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Vendor No:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono">{teacher.vendor_no || '—'}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Address:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-medium">{teacher.current_address || campus.address || '—'}</span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Phone:</span>
                <span className="border-b border-gray-300 flex-1 truncate">{teacher.contact_number || '—'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Blood Group:</span>
                <span className={`border-b border-gray-300 flex-1 truncate font-bold ${teacher.blood_group ? 'text-red-600' : ''}`}>{teacher.blood_group || '—'}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">E-mail:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-medium">
                {teacher.email && !teacher.email.includes('@school.local') ? teacher.email : '—'} {teacher.sed_no ? `• SED: ${teacher.sed_no}` : ''}
              </span>
            </div>
          </div>

          <div className="w-[18mm] flex flex-col items-center justify-center shrink-0 border-l border-gray-200 dark:border-gray-800 pl-1.5">
            <a
              href={verifyUrl}
              target="_blank"
              rel="noreferrer"
              title="Click or scan to verify"
              className="p-0.5 bg-white border border-gray-300 rounded shadow-xs hover:scale-105 transition-transform cursor-pointer"
            >
              {renderSvgQrCode(verifyUrl, 44)}
            </a>
            <span className="text-[5.5px] font-bold text-gray-500 uppercase mt-0.5 tracking-tighter">
              Scan to Verify
            </span>
          </div>
        </div>
      </div>

      <div className={`${bannerColor} flex items-center justify-between py-0.5 px-2 font-black text-[6.5px] tracking-widest uppercase shrink-0 relative z-10`}>
        <span className="truncate">IF FOUND PLEASE DROP IN THE LETTER BOX</span>
        <div className="flex items-center gap-0.5 text-[6px] font-normal opacity-75 shrink-0">
          <img src="/logo.png" alt="" className="w-2 h-2 object-contain" />
          <span>EliteEdu</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherServiceCardBack;
