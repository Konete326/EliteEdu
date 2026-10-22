import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const GOLD = '#D97706';
const NAVY = '#0F172A';

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

const Template2GoldBlueFrame = ({
  holder = {},
  holderType = 'student',
  orientation = 'vertical',
  accentColor = '#1E3A8A',
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
            { label: 'FATHER NAME', value: fatherName || '—' },
            { label: 'ROLL NUMBER', value: rollNo || '—' },
            { label: 'DATE OF BIRTH', value: fmtDate(holder.dob) },
            { label: 'BLOOD GROUP', value: blood || '—' },
            { label: 'B-FORM NO', value: bform || '—' },
            { label: 'EMERGENCY', value: emergencyPhone },
            ...(transport ? [{ label: 'BUS ROUTE', value: transport }] : [])
          ]
        : [
            { label: 'GR NUMBER', value: holder.gr_number || '—' },
            { label: 'CLASS / SEC', value: classWithSec },
            { label: 'FATHER NAME', value: fatherName || '—' },
            { label: 'ROLL NUMBER', value: rollNo || '—' },
            { label: 'ADMISSION', value: fmtDate(holder.date_of_admission || holder.admission_date) }
          ])
    : [
        { label: 'STAFF ID', value: holder.employee_code || holder.personal_id || '—' },
        { label: 'DESIGNATION', value: `${holder.designation || 'Staff'}${holder.bps_grade ? ` (BPS-${holder.bps_grade})` : ''}` },
        { label: 'DEPARTMENT', value: holder.department || 'Faculty' },
        { label: 'JOINED', value: fmtDate(holder.date_of_joining || holder.joining_date) },
        ...(isFrontOnly
          ? [
              { label: 'CNIC', value: holder.cnic || '—' },
              { label: 'BLOOD', value: holder.blood_group || '—' },
              { label: 'PHONE', value: holder.contact_number || holder.whatsapp_number || '—' }
            ]
          : [])
      ];

  const badge = isStudent ? 'STUDENT' : (holder.designation || 'FACULTY').toUpperCase();

  if (orientation === 'horizontal') {
    return (
      <div
        onClick={onToggleSelect}
        style={isSelected ? { outline: `2px solid ${GOLD}`, outlineOffset: '2px', boxShadow: `0 12px 28px -6px ${GOLD}50` } : {}}
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none border-2 border-amber-600/60 p-0.5 ${
          isSelected ? 'shadow-xl' : ''
        }`}
      >
        <div className="relative flex flex-col justify-between w-full h-full rounded-[14px] overflow-hidden border border-amber-400/40 bg-linear-to-b from-white via-amber-50/20 to-white">
          <div
            className="relative px-3 py-1.5 flex items-center justify-between shrink-0 border-b border-amber-500/30"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${accentColor} 70%, ${GOLD} 100%)` }}
          >
            <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-slate-950 bg-amber-400 tracking-wider shadow-xs border border-amber-300">
                {badge}
              </span>
            </div>
          </div>

          <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
            <div className="flex flex-col items-center justify-center shrink-0">
              <IdCardPhotoAvatar
                photoUrl={holder.photo_url}
                name={holder.name}
                size={isFrontOnly ? 68 : 74}
                ringColor={GOLD}
                ringWidth={2.5}
                shape="square"
              />
              <span className="mt-1 text-[6.5px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                CR80 SECURE
              </span>
            </div>

            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <div className="border-b border-amber-200/60 pb-0.5">
                <span className="font-serif font-black text-[11px] uppercase tracking-wide truncate block text-slate-900">
                  {holder.name}
                </span>
                <span className="text-[7.5px] font-bold text-amber-800 block truncate">
                  {isStudent ? `${classWithSec} ${rollNo ? '• Roll: ' + rollNo : ''}` : (holder.designation || 'Faculty')}
                </span>
              </div>

              <div className="w-full">
                <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[6.8px]" />
              </div>

              <div className="w-full flex justify-center py-0.5 text-slate-800">
                {renderSvgBarcode(codeVal, 150, 14)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-1 border-t border-amber-300/50 mt-auto bg-amber-50/60">
            <OfficialSignatureStampBlock compact={true} signatureTitle="Official Seal & Sign" />
            <div className="shrink-0 flex items-center gap-1.5">
              <div className="text-right">
                <span className="text-[5.5px] block font-bold text-amber-700">HERITAGE ID</span>
                <span className="text-[6.5px] block font-mono font-bold text-slate-900">{codeVal}</span>
              </div>
              {renderSvgQrCode(verifyUrl, 30)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      style={isSelected ? { outline: `2px solid ${GOLD}`, outlineOffset: '2px', boxShadow: `0 12px 28px -6px ${GOLD}50` } : {}}
      className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white border-2 border-amber-600/70 p-0.5 select-none ${
        isSelected ? 'shadow-xl' : ''
      }`}
    >
      <div className="relative flex flex-col justify-between w-full h-full rounded-[14px] overflow-hidden border border-amber-400/50 bg-linear-to-b from-white via-amber-50/15 to-white">
        <div
          className="relative px-3 pt-2 pb-6 border-b border-amber-500/40 text-center"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${accentColor} 65%, ${GOLD} 100%)` }}
        >
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="inline-block mt-1 text-[7px] font-black px-2.5 py-0.5 rounded-full text-slate-950 bg-amber-400 uppercase tracking-widest shadow-xs">
            {badge}
          </span>
        </div>

        <div className="relative -mt-6 flex justify-center z-10">
          <IdCardPhotoAvatar
            photoUrl={holder.photo_url}
            name={holder.name}
            size={isFrontOnly ? 68 : 74}
            ringColor={GOLD}
            ringWidth={3}
            shape="square"
          />
        </div>

        <div className="flex flex-col items-center px-3 pt-1 pb-1 gap-1 flex-1 text-center">
          <span className="font-serif font-black text-[11px] uppercase tracking-wide truncate max-w-[215px] text-slate-900">
            {holder.name}
          </span>
          <span className="text-[7.5px] font-bold text-amber-800 -mt-0.5">
            {isStudent ? `${classWithSec} ${rollNo ? '• Roll: ' + rollNo : ''}` : (holder.designation || 'Staff')}
          </span>

          <div className="w-full mt-1 text-left">
            <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.2px]" />
          </div>

          <div className="mt-1 w-full flex justify-center text-slate-800">
            {renderSvgBarcode(codeVal, 175, 18)}
          </div>
        </div>

        <div className="px-3 py-1 border-t border-amber-300/40 bg-amber-50/70 flex items-center justify-between">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Official Seal & Sign" />
          <div className="shrink-0">{renderSvgQrCode(verifyUrl, 30)}</div>
        </div>
      </div>
    </div>
  );
};

export default Template2GoldBlueFrame;
