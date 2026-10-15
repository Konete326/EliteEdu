export const formatCnicArray = (cnic) => {
  const digits = String(cnic || '4220198632893').replace(/\D/g, '').padEnd(13, ' ');
  return [
    digits[0], digits[1], digits[2], digits[3], digits[4],
    '-',
    digits[5], digits[6], digits[7], digits[8], digits[9], digits[10], digits[11],
    '-',
    digits[12]
  ];
};

export const formatPersonalIdArray = (pid) => {
  const digits = String(pid || '11034103').replace(/\D/g, '').slice(0, 8).padEnd(8, ' ');
  return digits.split('');
};

const TeacherIdBackBoxes = ({ cnic, personalId, dob }) => {
  const cnicChars = formatCnicArray(cnic);
  const persChars = formatPersonalIdArray(personalId);

  return (
    <div className="space-y-1">
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
          <span className="font-bold border-b border-gray-400 px-1 font-mono text-[7px]">{dob}</span>
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
    </div>
  );
};

export default TeacherIdBackBoxes;
