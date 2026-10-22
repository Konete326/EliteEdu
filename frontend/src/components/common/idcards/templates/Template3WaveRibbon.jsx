import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';
import { Wifi, Cpu } from 'lucide-react';

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

const Template3WaveRibbon = ({
  holder = {},
  holderType = 'student',
  orientation = 'vertical',
  accentColor = '#059669',
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
            { label: 'GR NUMBER', value: holder.gr_number || '—' },
            { label: 'CLASS / SEC', value: classWithSec },
            { label: 'FATHER', value: fatherName ? `S/O ${fatherName}` : '—' },
            { label: 'ROLL NO', value: rollNo || '—' },
            { label: 'BIRTH DATE', value: fmtDate(holder.dob) },
            { label: 'BLOOD GRP', value: blood || '—' },
            { label: 'B-FORM ID', value: bform || '—' },
            { label: 'EMERGENCY', value: emergencyPhone },
            ...(transport ? [{ label: 'BUS ROUTE', value: transport }] : [])
          ]
        : [
            { label: 'GR NUMBER', value: holder.gr_number || '—' },
            { label: 'CLASS / SEC', value: classWithSec },
            { label: 'FATHER', value: fatherName ? `S/O ${fatherName}` : '—' },
            { label: 'ROLL NO', value: rollNo || '—' },
            { label: 'SESSION', value: fmtDate(holder.date_of_admission || holder.admission_date) }
          ])
    : [
        { label: 'FACULTY ID', value: holder.employee_code || holder.personal_id || '—' },
        { label: 'DESIGNATION', value: `${holder.designation || 'Faculty'}${holder.bps_grade ? ` (BPS-${holder.bps_grade})` : ''}` },
        { label: 'DEPARTMENT', value: holder.department || 'Academics' },
        { label: 'JOINED', value: fmtDate(holder.date_of_joining || holder.joining_date) },
        ...(isFrontOnly
          ? [
              { label: 'CNIC', value: holder.cnic || '—' },
              { label: 'BLOOD', value: holder.blood_group || '—' },
              { label: 'PHONE', value: holder.contact_number || holder.whatsapp_number || '—' }
            ]
          : [])
      ];

  const badge = isStudent ? 'STUDENT' : (holder.designation || 'STAFF').toUpperCase();

  if (orientation === 'horizontal') {
    return (
      <div
        onClick={onToggleSelect}
        style={isSelected ? { outline: `2px solid ${accentColor}`, outlineOffset: '2px', boxShadow: `0 12px 28px -6px ${accentColor}40` } : {}}
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none border border-slate-200 ${
          isSelected ? 'shadow-xl' : ''
        }`}
      >
        <div className="relative px-3 py-1 flex items-center justify-between shrink-0 bg-slate-900 text-white">
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider"
              style={{ background: accentColor }}
            >
              {badge}
            </span>
            <Wifi className="w-3.5 h-3.5 rotate-90 text-slate-400" />
          </div>
        </div>

        <div className="h-1.5 w-full flex">
          <div className="h-full w-2/3" style={{ background: accentColor }} />
          <div className="h-full w-1/3 bg-amber-400" />
        </div>

        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="flex items-center justify-between w-full mb-1">
              <div className="w-6 h-4 rounded bg-amber-400/90 border border-amber-500 shadow-2xs flex items-center justify-center">
                <Cpu className="w-2.5 h-2.5 text-amber-900" />
              </div>
              <span className="text-[6px] font-mono text-slate-400 font-bold">NFC</span>
            </div>
            <IdCardPhotoAvatar
              photoUrl={holder.photo_url}
              name={holder.name}
              size={isFrontOnly ? 66 : 72}
              ringColor={accentColor}
              ringWidth={2}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
            <div className="border-b border-slate-100 pb-0.5 flex items-center justify-between">
              <div>
                <span
                  className="font-black text-[11px] uppercase tracking-wide truncate block"
                  style={{ color: accentColor }}
                >
                  {holder.name}
                </span>
                <span className="text-[7.5px] font-semibold text-slate-600 block truncate">
                  {isStudent ? `${classWithSec} ${rollNo ? '• Roll: ' + rollNo : ''}` : (holder.designation || 'Staff')}
                </span>
              </div>
              {blood && (
                <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                  {blood}
                </span>
              )}
            </div>

            <div className="w-full">
              <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[6.8px]" />
            </div>

            <div className="w-full flex justify-center py-0.5" style={{ color: accentColor }}>
              {renderSvgBarcode(codeVal, 150, 14)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-1 border-t border-slate-100 mt-auto bg-slate-50/70">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Verified Registrar" />
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="text-right">
              <span className="text-[5.5px] block font-mono font-bold text-slate-400">SMART PASS</span>
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
      <div className="relative shrink-0 pt-2 pb-6 px-3 bg-slate-900 text-white">
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
          <div className="flex items-center gap-1">
            <div className="w-5 h-3.5 rounded bg-amber-400 border border-amber-500 shadow-2xs flex items-center justify-center">
              <Cpu className="w-2 h-2 text-amber-900" />
            </div>
            <span className="text-[6.5px] font-mono font-bold text-amber-300">SMART ID</span>
          </div>
          <Wifi className="w-3.5 h-3.5 rotate-90 text-slate-400" />
        </div>
        <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
      </div>

      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full w-2/3" style={{ background: accentColor }} />
        <div className="h-full w-1/3 bg-amber-400" />
      </div>

      <div className="relative -mt-7 flex justify-center z-10">
        <IdCardPhotoAvatar
          photoUrl={holder.photo_url}
          name={holder.name}
          size={isFrontOnly ? 68 : 74}
          ringColor="#ffffff"
          ringWidth={3}
        />
      </div>

      <div className="flex flex-col items-center px-3 pt-1 pb-1 gap-1 flex-1 text-center">
        <span
          className="font-black text-[11px] uppercase tracking-wide truncate max-w-[215px]"
          style={{ color: accentColor }}
        >
          {holder.name}
        </span>

        <div className="flex items-center gap-1.5 -mt-0.5">
          <span
            className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white tracking-wider"
            style={{ background: accentColor }}
          >
            {badge}
          </span>
          {blood && (
            <span className="text-[6.8px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700">
              {blood}
            </span>
          )}
        </div>

        <div className="w-full mt-1 text-left">
          <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.2px]" />
        </div>

        <div className="mt-1 w-full flex justify-center" style={{ color: accentColor }}>
          {renderSvgBarcode(codeVal, 175, 18)}
        </div>
      </div>

      <div className="px-3 py-1 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <OfficialSignatureStampBlock compact={true} signatureTitle="Verified Registrar" />
        <div className="shrink-0">{renderSvgQrCode(verifyUrl, 30)}</div>
      </div>
    </div>
  );
};

export default Template3WaveRibbon;
