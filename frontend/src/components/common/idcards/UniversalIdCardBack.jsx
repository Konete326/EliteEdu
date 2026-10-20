import { renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../OfficialSignatureStampBlock.jsx';
import IdCardInstHeader from './IdCardInstHeader.jsx';

const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt) ? d : `${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};
const addYears = (d, y) => {
  if (!d) return '';
  const dt = new Date(d);
  dt.setFullYear(dt.getFullYear() + y);
  return fmtDate(dt);
};

const UniversalIdCardBack = ({
  holder = {},
  holderType = 'student',
  orientation = 'vertical',
  accentColor = '#003B73',
  institution = {},
  isSelected,
  onToggleSelect,
}) => {
  const isStudent = holderType === 'student';
  const joinDate = holder.date_of_joining || holder.date_of_admission;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const isHoriz = orientation === 'horizontal';

  if (isHoriz) {
    return (
      <div
        onClick={onToggleSelect}
        className={`relative flex flex-col justify-between rounded-xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white p-2.5 border border-slate-200 select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-1 shrink-0">
          <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
          <span className="text-[7px] font-bold px-2 py-0.5 rounded text-white shrink-0" style={{ background: accentColor }}>
            {isStudent ? 'STUDENT CARD' : 'FACULTY CARD'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[7.5px] text-slate-700 py-1 flex-1 items-center">
          <div className="space-y-1">
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span className="font-semibold text-slate-500">ISSUED:</span><span>{fmtDate(joinDate)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span className="font-semibold text-slate-500">EXPIRES:</span><span>{addYears(joinDate, 3)}</span>
            </div>
            {holder.cnic && (
              <div className="flex justify-between border-b border-slate-100 pb-0.5">
                <span className="font-semibold text-slate-500">CNIC:</span><span>{holder.cnic}</span>
              </div>
            )}
          </div>
          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[7px] text-center text-slate-600 flex flex-col justify-center">
            <span className="font-semibold text-slate-400 uppercase text-[6px]">Return if lost to</span>
            <strong className="text-slate-800 line-clamp-1">{institution.institutionName || 'THE INSTITUTION'}</strong>
            <span className="text-slate-500 text-[6.5px] line-clamp-1">{institution.areaName || institution.campusName}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-200 shrink-0 mt-auto">
          <OfficialSignatureStampBlock compact={true} />
          <div className="shrink-0">{renderSvgQrCode(verifyUrl, 32)}</div>
        </div>
        <span className="absolute bottom-0.5 right-1 text-[6.5px] font-bold tracking-widest opacity-25">EliteEdu</span>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      className={`relative flex flex-col justify-between rounded-xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white p-3 border border-slate-200 select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="text-center border-b border-slate-200 pb-1.5 space-y-1 shrink-0">
        <p className="font-extrabold text-[8px] uppercase tracking-widest text-slate-700">
          {isStudent ? 'STUDENT IDENTITY CARD' : 'FACULTY IDENTITY CARD'}
        </p>
        <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
      </div>
      <div className="text-[8px] flex flex-col gap-1.5 py-1 text-slate-700 flex-1">
        <div className="flex justify-between border-b border-slate-100 pb-0.5">
          <span className="font-semibold text-slate-500">ISSUED:</span><span>{fmtDate(joinDate)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-0.5">
          <span className="font-semibold text-slate-500">VALID THRU:</span><span>{addYears(joinDate, 3)}</span>
        </div>
        {holder.cnic && (
          <div className="flex justify-between border-b border-slate-100 pb-0.5">
            <span className="font-semibold text-slate-500">CNIC:</span><span>{holder.cnic}</span>
          </div>
        )}
        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[7.5px] text-center text-slate-600 mt-2">
          <p className="font-semibold text-slate-400 uppercase text-[6.5px]">If found please return to:</p>
          <strong className="text-slate-800 block text-[8px]">{institution.institutionName || 'THE INSTITUTION'}</strong>
          <p className="text-slate-500 text-[7px] mt-0.5">{institution.areaName || institution.campusName}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 pt-1 border-t border-slate-200 shrink-0">
        <OfficialSignatureStampBlock compact={true} />
        <div className="pt-0.5">{renderSvgQrCode(verifyUrl, 36)}</div>
      </div>
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

export default UniversalIdCardBack;
