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

const AcademicWatermark = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="acad" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <text x="4" y="20" fontSize="14" fill="#1e293b">🎓</text>
        <text x="28" y="44" fontSize="10" fill="#1e293b">★</text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#acad)" />
  </svg>
);

const Template4ApwaClassic = ({ holder = {}, holderType = 'student', orientation = 'vertical', accentColor = '#003B73', institution = {}, isSelected, onToggleSelect }) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? holder.gr_number : holder.employee_code;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const rows = isStudent
    ? [{ label: 'ID', value: holder.gr_number }, { label: 'Class', value: holder.current_grade?.name }, { label: 'DOA', value: fmtDate(holder.date_of_admission) }]
    : [{ label: 'ID', value: holder.employee_code }, { label: 'Role', value: holder.designation }, { label: 'DOJ', value: fmtDate(holder.date_of_joining) }];

  if (orientation === 'horizontal') {
    return (
      <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-[#F8FAFC] select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <AcademicWatermark />
        <div className="relative px-2.5 py-1 flex items-center justify-between shrink-0 border-b border-slate-200 bg-white" style={{ borderTop: `3px solid ${accentColor}` }}>
          <IdCardInstHeader {...institution} textColor="#1e293b" compact={true} bgColor="transparent" />
          <span className="text-[7px] font-bold uppercase underline shrink-0" style={{ color: accentColor }}>{isStudent ? 'STUDENT' : 'STAFF'}</span>
        </div>
        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center z-10">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={64} ringColor={accentColor} ringWidth={2.5} />
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <span className="font-extrabold text-[10px] uppercase tracking-wide truncate" style={{ color: accentColor }}>{holder.name}</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7px] text-slate-700">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-slate-200/60 pb-0.5">
                  <span className="font-semibold text-slate-500">{r.label}:</span>
                  <span className="font-medium truncate ml-1">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center py-0.5" style={{ color: accentColor }}>
              {renderSvgBarcode(codeVal, 140, 15)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-1 border-t border-slate-200 mt-auto bg-white/80 z-10">
          <OfficialSignatureStampBlock compact={true} />
          <div className="shrink-0 rounded p-0.5 bg-white shadow-xs">{renderSvgQrCode(verifyUrl, 32)}</div>
        </div>
        <span className="absolute bottom-0.5 right-1 text-[6.5px] font-bold tracking-widest opacity-25">EliteEdu</span>
      </div>
    );
  }

  return (
    <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-[#F8FAFC] select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcademicWatermark />
      <div className="flex flex-col items-center pt-3 pb-1 px-3 gap-1 relative z-10">
        <div className="bg-white rounded-xl shadow-sm flex items-center justify-center h-12 w-12">
          {institution.logoUrl ? <img src={institution.logoUrl} className="h-10 w-10 object-contain" alt="logo" /> : <span className="text-xl">🎓</span>}
        </div>
        <span className="font-extrabold text-[8px] uppercase text-center tracking-wide" style={{ color: accentColor }}>{institution.institutionName || 'INSTITUTION'}</span>
        {institution.areaName && <span className="text-[6px] text-slate-500">{institution.areaName}{institution.semisCode ? ` | SEMIS: ${institution.semisCode}` : ''}</span>}
        {institution.urduMotto && <span className="text-[6px] text-slate-400" style={{ direction: 'rtl', fontFamily: 'serif' }}>{institution.urduMotto}</span>}
      </div>
      <div className="flex flex-col items-center gap-1.5 px-3 pb-2 flex-1 relative z-10">
        <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={72} ringColor={accentColor} ringWidth={3} />
        <div className="bg-white rounded-full px-3 py-0.5 shadow-sm flex justify-center w-full" style={{ color: accentColor }}>{renderSvgBarcode(codeVal, 190, 18)}</div>
        <span className="font-extrabold text-[10px] uppercase text-center" style={{ color: accentColor }}>{holder.name}</span>
        <span className="text-[7px] font-bold uppercase underline" style={{ color: accentColor }}>{isStudent ? 'STUDENT' : 'STAFF'}</span>
        <div className="w-full"><IdCardDataRows rows={rows} textColorClass="text-slate-700" labelColorClass="text-slate-500" /></div>
        <div className="flex items-end justify-between w-full mt-auto pt-1">
          <OfficialSignatureStampBlock compact={true} />
          <div className="bg-white rounded-lg shadow-sm p-0.5">{renderSvgQrCode(verifyUrl, 40)}</div>
        </div>
      </div>
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

export default Template4ApwaClassic;
