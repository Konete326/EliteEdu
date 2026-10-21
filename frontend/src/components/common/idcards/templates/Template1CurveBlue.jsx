import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt) ? d : `${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const resolveEmergency = (em) => {
  if (!em) return '';
  if (typeof em === 'object') return em.phone || em.name || '';
  return String(em);
};

const Template1CurveBlue = ({
  holder = {},
  holderType = 'teacher',
  orientation = 'vertical',
  accentColor = '#003B73',
  institution = {},
  isSelected,
  onToggleSelect,
  sideMode = 'front'
}) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? holder.gr_number : (holder.employee_code || holder.personal_id || 'EMP-001');
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const isFrontOnly = sideMode === 'front';

  const rows = isStudent
    ? [
        { label: 'GR NO', value: holder.gr_number },
        { label: 'CLASS', value: holder.current_grade?.name },
        { label: 'ADMISSION', value: fmtDate(holder.date_of_admission) },
        { label: 'PHONE', value: holder.parent_phone },
        ...(isFrontOnly ? [{ label: 'BLOOD', value: holder.blood_group }, { label: 'EMERGENCY', value: resolveEmergency(holder.emergency_contact) }] : [])
      ]
    : [
        { label: 'STAFF ID', value: holder.employee_code || holder.personal_id },
        { label: 'ROLE', value: `${holder.designation || 'Faculty'}${holder.bps_grade ? ` (BPS-${holder.bps_grade})` : ''}` },
        { label: 'DEPT', value: holder.department || 'Academics' },
        { label: 'JOINED', value: fmtDate(holder.date_of_joining || holder.joining_date) },
        ...(isFrontOnly
          ? [
              { label: 'CNIC', value: holder.cnic },
              { label: 'BLOOD', value: holder.blood_group },
              { label: 'PHONE', value: holder.contact_number || holder.whatsapp_number }
            ]
          : [])
      ];

  const badge = isStudent ? 'STUDENT' : (holder.designation || 'FACULTY').toUpperCase();

  if (orientation === 'horizontal') {
    return (
      <div
        onClick={onToggleSelect}
        style={isSelected ? { outline: `2px solid ${accentColor}`, outlineOffset: '2px', boxShadow: `0 12px 28px -6px ${accentColor}40` } : {}}
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none border border-slate-200 ${
          isSelected ? 'shadow-xl' : ''
        }`}
      >
        <div
          className="relative px-3 py-1 flex items-center justify-between shrink-0"
          style={{ background: accentColor }}
        >
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="text-[7.5px] font-black text-white px-2.5 py-0.5 rounded-full bg-white/20 tracking-wider shrink-0 border border-white/20">
            {badge}
          </span>
        </div>

        <div className="flex flex-1 px-3.5 py-1.5 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar
              photoUrl={holder.photo_url}
              name={holder.name}
              size={isFrontOnly ? 72 : 78}
              ringColor={accentColor}
              ringWidth={2.5}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="border-b border-slate-100 pb-0.5">
              <span
                className="font-black text-[11px] uppercase tracking-wide truncate block"
                style={{ color: accentColor }}
              >
                {holder.name}
              </span>
              <span className="text-[8px] font-bold text-slate-500 block truncate">
                {holder.designation || 'Faculty Member'} {holder.bps_grade ? `• BPS-${holder.bps_grade}` : ''}
              </span>
            </div>

            <div className="w-full">
              <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7px]" />
            </div>

            <div className="w-full flex justify-center py-0.5" style={{ color: accentColor }}>
              {renderSvgBarcode(codeVal, 160, 16)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3.5 py-1 border-t border-slate-200 mt-auto bg-slate-50/80">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
          <div className="shrink-0 flex items-center gap-1.5">
            {isFrontOnly && (
              <span className="text-[6px] text-slate-400 font-bold text-right leading-tight">
                VERIFIED<br />FACULTY
              </span>
            )}
            {renderSvgQrCode(verifyUrl, 32)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      style={isSelected ? { outline: `2px solid ${accentColor}`, outlineOffset: '2px', boxShadow: `0 12px 28px -6px ${accentColor}40` } : {}}
      className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white border border-slate-200 select-none ${
        isSelected ? 'shadow-xl' : ''
      }`}
    >
      <div className="relative shrink-0 h-[96px] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 248 96" preserveAspectRatio="none">
          <path d="M0,0 L248,0 L248,70 Q124,96 0,70 Z" fill={accentColor} />
        </svg>

        <div className="relative z-10 pt-1">
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
        </div>

        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
          <IdCardPhotoAvatar
            photoUrl={holder.photo_url}
            name={holder.name}
            size={isFrontOnly ? 72 : 78}
            ringColor="#ffffff"
            ringWidth={3}
          />
        </div>
      </div>

      <div className="flex flex-col items-center px-3 pt-9 pb-1.5 gap-1 flex-1 text-center">
        <span
          className="font-black text-[11px] uppercase tracking-wide truncate max-w-[220px]"
          style={{ color: accentColor }}
        >
          {holder.name}
        </span>

        <span
          className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white tracking-wider"
          style={{ background: accentColor }}
        >
          {badge}
        </span>

        <div className="w-full mt-1.5 text-left">
          <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.5px]" />
        </div>

        <div className="mt-1 w-full flex justify-center" style={{ color: accentColor }}>
          {renderSvgBarcode(codeVal, 190, 20)}
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
        <div className="shrink-0">{renderSvgQrCode(verifyUrl, 32)}</div>
      </div>
    </div>
  );
};

export default Template1CurveBlue;