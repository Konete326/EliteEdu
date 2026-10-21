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
  sideMode = 'both'
}) => {
  const isStudent = holderType === 'student';
  const joinDate = holder.date_of_joining || holder.joining_date || holder.date_of_admission;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const isHoriz = orientation === 'horizontal';

  const resolveEmergency = (em) => {
    if (!em) return '';
    if (typeof em === 'object') return em.phone || em.name || '';
    return String(em);
  };
  const phone = holder.contact_number || holder.phone || holder.parent_phone || '';
  const emergency = resolveEmergency(holder.emergency_contact);
  const blood = holder.blood_group || '';
  const campus = institution.campusName || holder.campus_id?.name || 'Main Campus';
  const schoolPhone = institution.schoolPhone || institution.phone || '';

  if (isHoriz) {
    return (
      <div
        onClick={onToggleSelect}
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white p-3 border border-slate-200 select-none ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-1 shrink-0">
          <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
          <span
            className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider shrink-0"
            style={{ background: accentColor }}
          >
            {isStudent ? 'STUDENT CARD' : 'FACULTY CARD'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[7.5px] text-slate-700 py-1.5 flex-1 items-center">
          <div className="space-y-1 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
            <div className="flex justify-between border-b border-slate-200/60 pb-0.5">
              <span className="font-bold text-slate-500">ISSUED:</span>
              <span className="font-semibold">{fmtDate(joinDate) || '01/2024'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-0.5">
              <span className="font-bold text-slate-500">VALID THRU:</span>
              <span className="font-semibold">{addYears(joinDate, 3) || '01/2027'}</span>
            </div>
            {holder.cnic && (
              <div className="flex justify-between border-b border-slate-200/60 pb-0.5">
                <span className="font-bold text-slate-500">CNIC:</span>
                <span className="font-semibold">{holder.cnic}</span>
              </div>
            )}
            {blood && (
              <div className="flex justify-between border-b border-slate-200/60 pb-0.5">
                <span className="font-bold text-slate-500">BLOOD GROUP:</span>
                <span className="font-bold text-red-600">{blood}</span>
              </div>
            )}
            {emergency && (
              <div className="flex justify-between pb-0.5">
                <span className="font-bold text-slate-500">EMERGENCY:</span>
                <span className="font-semibold">{emergency}</span>
              </div>
            )}
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[7px] text-center text-slate-600 flex flex-col justify-center space-y-0.5">
            <span className="font-bold text-slate-400 uppercase text-[6.5px]">If found please return to:</span>
            <strong className="text-slate-900 line-clamp-1 text-[8px] uppercase">
              {institution.institutionName || 'THE INSTITUTION'}
            </strong>
            <p className="text-slate-500 text-[6.5px] line-clamp-1">{campus}</p>
            {schoolPhone && (
              <p className="text-slate-600 font-semibold text-[6.5px]">Helpline: {schoolPhone}</p>
            )}
            <p className="text-[6px] text-slate-400 italic">This card remains property of the institution.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200 shrink-0 mt-auto bg-slate-50/50 -mx-3 -mb-3 px-3 py-1.5">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="text-right">
              <span className="text-[6px] block font-bold text-slate-400">SCAN TO VERIFY</span>
              <span className="text-[6.5px] block font-mono font-bold text-slate-700">{holder.employee_code || ''}</span>
            </div>
            {renderSvgQrCode(verifyUrl, 32)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white p-3 border border-slate-200 select-none ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="text-center border-b border-slate-200 pb-2 space-y-1 shrink-0">
        <span
          className="inline-block text-[7.5px] font-black px-3 py-0.5 rounded-full text-white uppercase tracking-wider mb-1"
          style={{ background: accentColor }}
        >
          {isStudent ? 'STUDENT IDENTITY CARD' : 'FACULTY SERVICE CARD'}
        </span>
        <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
      </div>

      <div className="text-[8px] flex flex-col gap-1.5 py-1 text-slate-700 flex-1">
        <div className="flex justify-between border-b border-slate-100 pb-1">
          <span className="font-bold text-slate-500">CARD ISSUED:</span>
          <span className="font-semibold">{fmtDate(joinDate) || '01/2024'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1">
          <span className="font-bold text-slate-500">VALID THRU:</span>
          <span className="font-semibold">{addYears(joinDate, 3) || '01/2027'}</span>
        </div>
        {holder.cnic && (
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-500">CNIC NO:</span>
            <span className="font-semibold font-mono">{holder.cnic}</span>
          </div>
        )}
        {blood && (
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-500">BLOOD GROUP:</span>
            <span className="font-bold text-red-600">{blood}</span>
          </div>
        )}
        {emergency && (
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-500">EMERGENCY CONTACT:</span>
            <span className="font-semibold">{emergency}</span>
          </div>
        )}

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[7px] text-center text-slate-600 mt-2 space-y-0.5">
          <p className="font-bold text-slate-400 uppercase text-[6px]">Return if lost to:</p>
          <strong className="text-slate-900 block text-[8px] uppercase">
            {institution.institutionName || 'THE INSTITUTION'}
          </strong>
          <p className="text-slate-500 text-[7px]">{campus}</p>
          {schoolPhone && (
            <p className="text-slate-700 font-semibold text-[7px] mt-0.5">Emergency Helpline: {schoolPhone}</p>
          )}
          <p className="text-[6px] text-slate-400 italic mt-1">This card is non-transferable & official property.</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 shrink-0 space-y-1.5 bg-slate-50/60 -mx-3 -mb-3 p-3">
        <div className="flex items-center justify-between">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
          <div className="shrink-0 flex flex-col items-center">
            {renderSvgQrCode(verifyUrl, 34)}
            <span className="text-[5.5px] font-mono font-bold text-slate-400 mt-0.5">SCAN TO VERIFY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalIdCardBack;