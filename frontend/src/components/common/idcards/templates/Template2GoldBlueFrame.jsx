import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const GOLD = '#F5A623';
const NAVY = '#1a2744';
const ROYAL = '#2E4A9E';

const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt) ? d : `${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={GOLD} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const Template2GoldBlueFrame = ({ holder = {}, holderType = 'student', orientation = 'vertical', institution = {}, isSelected, onToggleSelect }) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? holder.gr_number : holder.employee_code;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const rows = isStudent
    ? [
        { label: 'ID', value: holder.gr_number },
        { label: 'Class', value: holder.current_grade?.name },
        { label: 'DOA', value: fmtDate(holder.date_of_admission) },
        { label: 'Phone', value: holder.parent_phone },
      ]
    : [
        { label: 'ID', value: holder.employee_code },
        { label: 'Role', value: holder.designation },
        { label: 'DOJ', value: fmtDate(holder.date_of_joining) },
        { label: 'CNIC', value: holder.cnic },
      ];
  const badge = isStudent ? '🎓 STUDENT' : holder.designation || 'STAFF';

  const cardCls = `relative flex bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`;

  if (orientation === 'horizontal') {
    return (
      <div onClick={onToggleSelect} className={`${cardCls} w-[390px] min-h-[245px]`} style={{ border: `3px solid ${GOLD}` }}>
        <div className="relative flex flex-col items-center justify-center w-[120px] shrink-0 overflow-hidden" style={{ background: ROYAL }}>
          <DotPattern />
          <div className="z-10"><IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={64} ringColor={GOLD} ringWidth={3} /></div>
          <span className="z-10 mt-1 text-[6.5px] font-bold px-2 py-0.5 rounded-full text-slate-900 tracking-wider" style={{ background: GOLD }}>{badge}</span>
        </div>
        <div className="flex flex-col flex-1 p-2 gap-1.5">
          <div className="relative overflow-hidden rounded-t-lg -mx-2 -mt-2 px-2 py-1" style={{ background: ROYAL }}>
            <DotPattern />
            <IdCardInstHeader {...institution} textColor="white" compact bgColor="transparent" />
          </div>
          <span className="font-extrabold text-[9px] uppercase tracking-wide" style={{ color: NAVY }}>{holder.name}</span>
          <IdCardDataRows rows={rows} textColorClass="text-slate-700" labelColorClass="text-slate-500" />
          <div className="mt-auto flex items-center justify-between pt-1">
            <div style={{ color: NAVY }}>{renderSvgBarcode(codeVal, 110, 18)}</div>
            <div className="rounded-lg p-0.5 shadow-sm border border-amber-200">{renderSvgQrCode(verifyUrl, 36)}</div>
          </div>
          <OfficialSignatureStampBlock compact={true} />
        </div>
        <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
      </div>
    );
  }

  return (
    <div onClick={onToggleSelect} className={`${cardCls} flex-col w-[248px] min-h-[390px]`} style={{ border: `3px solid ${GOLD}` }}>
      <div className="relative overflow-hidden shrink-0" style={{ background: ROYAL }}>
        <DotPattern />
        <IdCardInstHeader {...institution} textColor="white" bgColor="transparent" />
      </div>
      <div className="flex flex-col items-center px-3 py-2 gap-1.5 flex-1">
        <div style={{ border: `2px solid ${NAVY}`, borderRadius: 10 }}><IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={68} ringColor={GOLD} ringWidth={3} /></div>
        <span className="text-[7px] font-bold px-2 py-0.5 rounded-full text-slate-900 tracking-wider" style={{ background: GOLD }}>{badge}</span>
        <span className="font-extrabold text-[10px] uppercase tracking-wide text-center" style={{ color: NAVY }}>{holder.name}</span>
        <div className="w-full"><IdCardDataRows rows={rows} textColorClass="text-slate-700" labelColorClass="text-slate-500" /></div>
        <div className="mt-auto w-full flex justify-center" style={{ color: NAVY }}>{renderSvgBarcode(codeVal, 200, 20)}</div>
        <div className="flex items-center justify-between w-full pt-1">
          <OfficialSignatureStampBlock compact={true} />
          <div className="rounded-lg border border-amber-200 p-0.5 shadow-sm">{renderSvgQrCode(verifyUrl, 38)}</div>
        </div>
      </div>
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

export default Template2GoldBlueFrame;
