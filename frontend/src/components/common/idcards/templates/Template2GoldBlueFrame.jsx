import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const GOLD = '#D97706';
const NAVY = '#0F172A';

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

const Template2GoldBlueFrame = ({
  holder = {},
  holderType = 'teacher',
  orientation = 'vertical',
  accentColor = '#1E3A8A',
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
        { label: 'DOA', value: fmtDate(holder.date_of_admission) },
        { label: 'PHONE', value: holder.parent_phone },
        ...(isFrontOnly ? [{ label: 'BLOOD', value: holder.blood_group }, { label: 'EMERGENCY', value: resolveEmergency(holder.emergency_contact) }] : [])
      ]
    : [
        { label: 'STAFF ID', value: holder.employee_code || holder.personal_id },
        { label: 'DESIGNATION', value: `${holder.designation || 'Staff'}${holder.bps_grade ? ` (BPS-${holder.bps_grade})` : ''}` },
        { label: 'DEPARTMENT', value: holder.department || 'Faculty' },
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
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-lg cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none border-2 border-amber-500/40 ${
          isSelected ? 'ring-2 ring-amber-500 shadow-xl' : ''
        }`}
      >
        <div
          className="relative px-3 py-1.5 flex items-center justify-between shrink-0"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${accentColor} 100%)` }}
        >
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-slate-950 tracking-wider shrink-0 bg-amber-400 font-mono shadow-xs">
            {badge}
          </span>
        </div>

        <div className="flex flex-1 px-3.5 py-2 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar
              photoUrl={holder.photo_url}
              name={holder.name}
              size={isFrontOnly ? 72 : 78}
              ringColor={GOLD}
              ringWidth={2.5}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="border-b border-amber-100 pb-0.5">
              <span className="font-black text-[11px] uppercase tracking-wide truncate block text-slate-900">
                {holder.name}
              </span>
              <span className="text-[8px] font-bold text-amber-700 block truncate">
                {holder.designation || 'Faculty'} {holder.bps_grade ? `• BPS-${holder.bps_grade}` : ''}
              </span>
            </div>

            <div className="w-full">
              <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7px]" />
            </div>

            <div className="w-full flex justify-center py-0.5" style={{ color: NAVY }}>
              {renderSvgBarcode(codeVal, 160, 16)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3.5 py-1 border-t border-amber-200 mt-auto bg-amber-50/50">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="p-0.5 bg-white rounded border border-amber-300">
              {renderSvgQrCode(verifyUrl, 32)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-lg cursor-pointer w-[248px] min-h-[390px] bg-white border-2 border-amber-500/40 select-none ${
        isSelected ? 'ring-2 ring-amber-500 shadow-xl' : ''
      }`}
    >
      <div
        className="relative shrink-0 pb-7 pt-2 px-1"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${accentColor} 100%)` }}
      >
        <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />

        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
          <IdCardPhotoAvatar
            photoUrl={holder.photo_url}
            name={holder.name}
            size={isFrontOnly ? 72 : 78}
            ringColor={GOLD}
            ringWidth={3}
          />
        </div>
      </div>

      <div className="flex flex-col items-center px-3 pt-9 pb-1.5 gap-1 flex-1 text-center">
        <span className="font-black text-[11px] uppercase tracking-wide truncate max-w-[220px] text-slate-900">
          {holder.name}
        </span>

        <span className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-slate-950 tracking-wider bg-amber-400 font-mono shadow-xs">
          {badge}
        </span>

        <div className="w-full mt-1.5 text-left">
          <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.5px]" />
        </div>

        <div className="mt-1 w-full flex justify-center" style={{ color: NAVY }}>
          {renderSvgBarcode(codeVal, 190, 20)}
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-amber-200 bg-amber-50/50 flex items-center justify-between">
        <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
        <div className="shrink-0 p-0.5 bg-white rounded border border-amber-300">
          {renderSvgQrCode(verifyUrl, 32)}
        </div>
      </div>
    </div>
  );
};

export default Template2GoldBlueFrame;