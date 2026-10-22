import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt) ? String(d) : `${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const resolveEmergency = (holder) => {
  if (holder.emergency_contact_no) return String(holder.emergency_contact_no);
  if (typeof holder.emergency_contact === 'object') {
    return holder.emergency_contact?.phone || holder.emergency_contact?.name || '';
  }
  return holder.emergency_contact || holder.parent_phone || holder.contact_number || '—';
};

const Template1CurveBlue = ({
  holder = {},
  holderType = 'student',
  orientation = 'vertical',
  accentColor = '#003B73',
  institution = {},
  isSelected,
  onToggleSelect,
  sideMode = 'front'
}) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? (holder.gr_number || 'STU-001') : (holder.employee_code || holder.personal_id || 'EMP-001');
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const isFrontOnly = sideMode === 'front';

  const fatherName = holder.father_name || '';
  const gradeName = holder.current_grade?.name || holder.grade_name || 'Class N/A';
  const secName = holder.current_section || holder.section || '';
  const classWithSec = secName ? `${gradeName} (${secName})` : gradeName;
  const rollNo = holder.roll_number || holder.roll_no || '';
  const bform = holder.b_form || holder.cnic || '';
  const blood = holder.blood_group || '';
  const emergencyPhone = resolveEmergency(holder);
  const transport = holder.transport_route || '';

  const rows = isStudent
    ? (isFrontOnly
        ? [
            { label: 'GR NO', value: holder.gr_number || '—' },
            { label: 'CLASS', value: classWithSec },
            { label: 'FATHER', value: fatherName || '—' },
            { label: 'ROLL NO', value: rollNo || '—' },
            { label: 'DOB', value: fmtDate(holder.dob) },
            { label: 'BLOOD', value: blood || '—' },
            { label: 'B-FORM', value: bform || '—' },
            { label: 'EMERGENCY', value: emergencyPhone },
            ...(transport ? [{ label: 'ROUTE', value: transport }] : [])
          ]
        : [
            { label: 'GR NO', value: holder.gr_number || '—' },
            { label: 'CLASS', value: classWithSec },
            { label: 'FATHER', value: fatherName || '—' },
            { label: 'ROLL NO', value: rollNo || '—' },
            { label: 'SESSION', value: fmtDate(holder.date_of_admission || holder.admission_date) }
          ])
    : [
        { label: 'STAFF ID', value: holder.employee_code || holder.personal_id || '—' },
        { label: 'ROLE', value: `${holder.designation || 'Faculty'}${holder.bps_grade ? ` (BPS-${holder.bps_grade})` : ''}` },
        { label: 'DEPT', value: holder.department || 'Academics' },
        { label: 'JOINED', value: fmtDate(holder.date_of_joining || holder.joining_date) },
        ...(isFrontOnly
          ? [
              { label: 'CNIC', value: holder.cnic || '—' },
              { label: 'BLOOD', value: holder.blood_group || '—' },
              { label: 'PHONE', value: holder.contact_number || holder.whatsapp_number || '—' }
            ]
          : [])
      ];

  const badge = isStudent ? 'STUDENT IDENTITY' : (holder.designation || 'FACULTY MEMBER').toUpperCase();

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

        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar
              photoUrl={holder.photo_url}
              name={holder.name}
              size={isFrontOnly ? 68 : 74}
              ringColor={accentColor}
              ringWidth={2.5}
            />
            {blood && (
              <span className="mt-1 px-1.5 py-0.2 rounded bg-red-50 text-red-600 border border-red-200 text-[6.5px] font-bold">
                {blood}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
            <div className="border-b border-slate-100 pb-0.5">
              <span
                className="font-black text-[11px] uppercase tracking-wide truncate block"
                style={{ color: accentColor }}
              >
                {holder.name}
              </span>
              <span className="text-[7.5px] font-bold text-slate-600 block truncate">
                {isStudent ? `${classWithSec} ${rollNo ? '• Roll: ' + rollNo : ''}` : (holder.designation || 'Staff')}
              </span>
            </div>

            <div className="w-full">
              <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[6.8px]" />
            </div>

            <div className="w-full flex justify-center py-0.5" style={{ color: accentColor }}>
              {renderSvgBarcode(codeVal, 150, 14)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-1 border-t border-slate-200 mt-auto bg-slate-50/80">
          <OfficialSignatureStampBlock compact={true} signatureTitle={isStudent ? 'Principal Signature' : 'Authorized Signatory'} />
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="text-right">
              <span className="text-[5.5px] block font-bold text-slate-400">OFFICIAL PVC</span>
              <span className="text-[6.5px] block font-mono font-bold text-slate-700">{codeVal}</span>
            </div>
            {renderSvgQrCode(verifyUrl, 30)}
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
      <div className="relative shrink-0 h-[82px]">
        <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
          <svg className="w-full h-full" viewBox="0 0 248 82" preserveAspectRatio="none">
            <path d="M0,0 L248,0 L248,58 Q124,82 0,58 Z" fill={accentColor} />
          </svg>
        </div>

        <div className="relative z-10 pt-1.5">
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
        </div>
      </div>

      <div className="relative -mt-9 flex justify-center z-20 shrink-0">
        <IdCardPhotoAvatar
          photoUrl={holder.photo_url}
          name={holder.name}
          size={isFrontOnly ? 68 : 74}
          ringColor="#ffffff"
          ringWidth={3}
          fit="cover"
        />
      </div>

      <div className="flex flex-col items-center px-3 pt-1 pb-1 gap-1 flex-1 text-center">
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

        <div className="w-full mt-1 text-left">
          <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.2px]" />
        </div>

        <div className="mt-1 w-full flex justify-center" style={{ color: accentColor }}>
          {renderSvgBarcode(codeVal, 180, 18)}
        </div>
      </div>

      <div className="px-3 py-1 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <OfficialSignatureStampBlock compact={true} signatureTitle={isStudent ? 'Principal Signature' : 'Authorized Signatory'} />
        <div className="shrink-0">{renderSvgQrCode(verifyUrl, 30)}</div>
      </div>
    </div>
  );
};

export default Template1CurveBlue;
