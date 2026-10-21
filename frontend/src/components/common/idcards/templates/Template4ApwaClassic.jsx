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

const Template4ApwaClassic = ({
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
        className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-[#F8FAFC] select-none border border-slate-300 ${
          isSelected ? 'ring-2 ring-primary shadow-xl' : ''
        }`}
      >
        <div
          className="relative px-3 py-1 flex items-center justify-between shrink-0 bg-white border-b-2"
          style={{ borderBottomColor: accentColor }}
        >
          <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
          <span
            className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider shrink-0"
            style={{ background: accentColor }}
          >
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
              ringWidth={2}
              shape="square"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="border-b border-slate-200 pb-0.5">
              <span
                className="font-black text-[11px] uppercase tracking-wide truncate block"
                style={{ color: accentColor }}
              >
                {holder.name}
              </span>
              <span className="text-[8px] font-bold text-slate-600 block truncate">
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

        <div className="flex items-center justify-between px-3.5 py-1 border-t border-slate-200 mt-auto bg-white">
          <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
          <div className="shrink-0 flex items-center gap-1.5">
            {renderSvgQrCode(verifyUrl, 32)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggleSelect}
      className={`relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-[#F8FAFC] border border-slate-300 select-none ${
        isSelected ? 'ring-2 ring-primary shadow-xl' : ''
      }`}
    >
      <div
        className="relative shrink-0 pt-2 pb-1 bg-white border-b-2"
        style={{ borderBottomColor: accentColor }}
      >
        <IdCardInstHeader {...institution} textColor="#0f172a" compact={true} bgColor="transparent" />
      </div>

      <div className="flex flex-col items-center px-3 pt-3 pb-1.5 gap-1.5 flex-1 text-center">
        <IdCardPhotoAvatar
          photoUrl={holder.photo_url}
          name={holder.name}
          size={isFrontOnly ? 72 : 78}
          ringColor={accentColor}
          ringWidth={2.5}
          shape="square"
        />

        <div className="border-b border-slate-200/80 pb-1 w-full">
          <span
            className="font-black text-[11px] uppercase tracking-wide truncate block max-w-[220px]"
            style={{ color: accentColor }}
          >
            {holder.name}
          </span>
          <span
            className="text-[7.5px] font-black px-2.5 py-0.5 rounded-full text-white tracking-wider inline-block mt-0.5"
            style={{ background: accentColor }}
          >
            {badge}
          </span>
        </div>

        <div className="w-full text-left">
          <IdCardDataRows rows={rows} layout={isFrontOnly ? 'grid' : 'single'} fontSize="text-[7.5px]" />
        </div>

        <div className="mt-1 w-full flex justify-center" style={{ color: accentColor }}>
          {renderSvgBarcode(codeVal, 190, 20)}
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-slate-200 bg-white flex items-center justify-between">
        <OfficialSignatureStampBlock compact={true} signatureTitle="Authorized Signatory" />
        <div className="shrink-0">{renderSvgQrCode(verifyUrl, 32)}</div>
      </div>
    </div>
  );
};

export default Template4ApwaClassic;