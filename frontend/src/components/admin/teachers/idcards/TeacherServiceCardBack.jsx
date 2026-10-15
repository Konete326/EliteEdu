import { renderSvgQrCode, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const formatCnicArray = (cnic) => {
  const digits = String(cnic || '').replace(/\D/g, '').padEnd(13, ' ');
  const chars = [
    digits[0], digits[1], digits[2], digits[3], digits[4],
    '-',
    digits[5], digits[6], digits[7], digits[8], digits[9], digits[10], digits[11],
    '-',
    digits[12]
  ];
  return chars;
};

const formatPersonalIdArray = (pid) => {
  const digits = String(pid || '').replace(/\D/g, '').slice(0, 8).padEnd(8, ' ');
  return digits.split('');
};

const TeacherServiceCardBack = ({ teacher, config = {}, style = 'GovtSindh' }) => {
  const campus = teacher?.campus_id || {};
  const cnicChars = formatCnicArray(teacher?.cnic);
  const persChars = formatPersonalIdArray(teacher?.personal_id || teacher?.employee_code);
  const verifyUrl = generateStaffVerifyUrl(teacher?._id);

  const bannerColor = style === 'Institutional'
    ? 'bg-slate-900 text-white'
    : 'bg-emerald-800 text-white';

  const dobStr = teacher?.dob
    ? new Date(teacher.dob).toLocaleDateString('en-GB').replace(/\//g, '-')
    : 'DD-MM-YYYY';

  const apptDateStr = teacher?.appointment_date || teacher?.joining_date
    ? new Date(teacher.appointment_date || teacher.joining_date).toLocaleDateString('en-GB').replace(/\//g, '-')
    : '—';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[7.5px] leading-tight">
      <div className="p-2 space-y-1 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="font-bold text-[7px] text-gray-700 dark:text-gray-300 uppercase shrink-0">C.N.I.C No.</span>
          <div className="flex items-center gap-[1px]">
            {cnicChars.map((ch, idx) => (
              <span
                key={idx}
                className={`w-[4.2mm] h-[4mm] border ${ch === '-' ? 'border-transparent font-black' : 'border-gray-500 bg-gray-50 dark:bg-black/30'} flex items-center justify-center font-mono font-bold text-[7px]`}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[7px] text-gray-700 dark:text-gray-300 uppercase">D.O.B:</span>
            <span className="font-bold border-b border-gray-400 px-1 font-mono text-[7px]">{dobStr}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-[7px] text-gray-700 dark:text-gray-300 uppercase">Pers #:</span>
            <div className="flex items-center gap-[1px]">
              {persChars.map((ch, idx) => (
                <span
                  key={idx}
                  className="w-[3.6mm] h-[3.8mm] border border-gray-500 bg-gray-50 dark:bg-black/30 flex items-center justify-center font-mono font-bold text-[7px]"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-0.5">
          <div className="flex-1 space-y-0.5 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Date of Appt:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-semibold">{apptDateStr}</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Posting:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-semibold">{campus.name || 'Main Campus'}</span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">SEMIS:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono">{teacher.semis_code || campus.semis_code || '408110114'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Vendor:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-mono">{teacher.vendor_no || '—'}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Address:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-medium">{teacher.current_address || campus.address || 'Karachi, Sindh'}</span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Phone:</span>
                <span className="border-b border-gray-300 flex-1 truncate">{teacher.contact_number || '—'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">Blood:</span>
                <span className="border-b border-gray-300 flex-1 truncate font-bold text-red-600">{teacher.blood_group || 'O+'}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-600 dark:text-gray-400 text-[6.5px] uppercase shrink-0">E-mail / SED:</span>
              <span className="border-b border-gray-300 flex-1 truncate font-medium">
                {teacher.email && !teacher.email.includes('@school.local') ? teacher.email : '—'} {teacher.sed_no ? `• SED: ${teacher.sed_no}` : ''}
              </span>
            </div>
          </div>

          <div className="w-[18mm] flex flex-col items-center justify-center shrink-0 border-l border-gray-200 dark:border-gray-800 pl-1.5">
            <div className="p-0.5 bg-white border border-gray-300 rounded shadow-xs">
              {renderSvgQrCode(verifyUrl, 44)}
            </div>
            <span className="text-[5.5px] font-bold text-gray-500 uppercase mt-0.5 tracking-tighter">
              Scan to Verify
            </span>
          </div>
        </div>
      </div>

      <div className={`${bannerColor} text-center py-0.5 px-2 font-black text-[6.5px] tracking-widest uppercase shrink-0`}>
        IF FOUND PLEASE DROP IN THE LETTER BOX
      </div>
    </div>
  );
};

export default TeacherServiceCardBack;
