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

const Template1CurveBlue = ({ holder = {}, holderType = 'student', orientation = 'vertical', accentColor = '#003B73', institution = {}, isSelected, onToggleSelect }) => {
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
  const badge = isStudent ? '🎓 STUDENT' : `${holder.designation || 'STAFF'}`;

  if (orientation === 'horizontal') {
    return (
      <div onClick={onToggleSelect} className={`relative flex rounded-xl overflow-hidden shadow-md cursor-pointer w-[390px] min-h-[245px] bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="relative flex flex-col items-center justify-center w-[130px] shrink-0" style={{ background: accentColor }}>
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 130 245" preserveAspectRatio="none">
            <path d="M0,0 Q65,40 130,0 L130,245 L0,245 Z" fill="rgba(0,0,0,0.15)" />
          </svg>
          <div className="z-10 mt-4"><IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={60} ringColor="white" ringWidth={2} /></div>
          <span className="z-10 mt-1 text-[6.5px] font-bold text-white px-2 py-0.5 rounded-full bg-white/20 tracking-wider">{badge}</span>
        </div>
        <div className="flex flex-col flex-1 p-2 gap-1">
          <span className="font-extrabold text-[9px] uppercase tracking-wide" style={{ color: accentColor }}>{holder.name}</span>
          <IdCardDataRows rows={rows} textColorClass="text-slate-700" labelColorClass="text-slate-500" />
          <div className="mt-auto pt-1 flex items-center justify-between">
            <div style={{ color: accentColor }}>{renderSvgBarcode(codeVal, 110, 18)}</div>
            <div className="bg-white rounded p-0.5 shadow-sm">{renderSvgQrCode(verifyUrl, 36)}</div>
          </div>
          <OfficialSignatureStampBlock compact={true} />
        </div>
        <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
      </div>
    );
  }

  return (
    <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="relative shrink-0" style={{ height: 80 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 248 80" preserveAspectRatio="none">
          <path d="M0,0 L248,0 L248,55 Q124,80 0,55 Z" fill={accentColor} />
        </svg>
        <div className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 z-10">
          <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={60} ringColor={accentColor} ringWidth={2} />
        </div>
      </div>
      <div className="flex flex-col items-center px-3 pt-10 pb-2 gap-1 flex-1">
        <span className="font-extrabold text-[10px] uppercase tracking-wide text-center" style={{ color: accentColor }}>{holder.name}</span>
        <span className="text-[7px] font-bold px-2 py-0.5 rounded-full text-white tracking-wider" style={{ background: accentColor }}>{badge}</span>
        <div className="w-full mt-1"><IdCardDataRows rows={rows} /></div>
        <div className="mt-1 w-full flex justify-center" style={{ color: accentColor }}>{renderSvgBarcode(codeVal, 200, 20)}</div>
      </div>
      <div className="flex items-center justify-between px-2 py-1.5" style={{ background: accentColor }}>
        <div className="flex-1"><IdCardInstHeader {...institution} textColor="white" compact={true} /></div>
        <div className="bg-white rounded-full p-1 shadow">{renderSvgQrCode(verifyUrl, 36)}</div>
      </div>
      <div className="px-2 pb-1"><OfficialSignatureStampBlock compact={true} /></div>
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

export default Template1CurveBlue;
