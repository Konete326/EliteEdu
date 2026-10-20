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
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={GOLD} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const Template2GoldBlueFrame = ({ holder = {}, holderType = 'student', orientation = 'vertical', accentColor = ROYAL, institution = {}, isSelected, onToggleSelect }) => {
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

  if (orientation === 'horizontal') {
    return (
      <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-lg cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`} style={{ border: `2.5px solid ${GOLD}` }}>
        <div className="relative px-2.5 py-1 flex items-center justify-between shrink-0 overflow-hidden" style={{ background: accentColor }}>
          <DotPattern />
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="z-10 text-[7px] font-bold px-2 py-0.5 rounded-full text-slate-900 tracking-wider shrink-0" style={{ background: GOLD }}>{badge}</span>
        </div>
        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={64} ringColor={GOLD} ringWidth={2.5} />
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <span className="font-extrabold text-[10px] uppercase tracking-wide truncate" style={{ color: NAVY }}>{holder.name}</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7px] text-slate-700">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-amber-100 pb-0.5">
                  <span className="font-semibold text-slate-500">{r.label}:</span>
                  <span className="font-medium truncate ml-1">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center py-0.5" style={{ color: NAVY }}>
              {renderSvgBarcode(codeVal, 140, 15)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-1 border-t border-amber-200 mt-auto bg-amber-50/40">
          <OfficialSignatureStampBlock compact={true} />
          <div className="shrink-0 rounded p-0.5 bg-white border border-amber-200">{renderSvgQrCode(verifyUrl, 32)}</div>
        </div>
        <span className="absolute bottom-0.5 right-1 text-[6.5px] font-bold tracking-widest opacity-25">EliteEdu</span>
      </div>
    );
  }

  return (
    <div onClick={onToggleSelect} className={`relative flex flex-col bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer w-[248px] min-h-[390px] select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`} style={{ border: `3px solid ${GOLD}` }}>
      <div className="relative overflow-hidden shrink-0" style={{ background: accentColor }}>
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
