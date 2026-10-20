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
      <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="relative px-2.5 py-1 flex items-center justify-between shrink-0" style={{ background: accentColor }}>
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="text-[7px] font-bold text-white px-2 py-0.5 rounded-full bg-white/20 tracking-wider shrink-0">{badge}</span>
        </div>
        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
          <div className="flex flex-col items-center justify-center shrink-0">
            <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={64} ringColor={accentColor} ringWidth={2} />
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <span className="font-extrabold text-[10px] uppercase tracking-wide truncate" style={{ color: accentColor }}>{holder.name}</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7px] text-slate-700">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-slate-100 pb-0.5">
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
        <div className="flex items-center justify-between px-3 py-1 border-t border-slate-200 mt-auto bg-slate-50/70">
          <OfficialSignatureStampBlock compact={true} />
          <div className="shrink-0">{renderSvgQrCode(verifyUrl, 32)}</div>
        </div>
        <span className="absolute bottom-0.5 right-1 text-[6.5px] font-bold tracking-widest opacity-25">EliteEdu</span>
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
      <div className="px-2 py-1.5" style={{ background: accentColor }}>
        <IdCardInstHeader {...institution} textColor="white" compact={true} />
      </div>
      <div className="px-2 pb-1"><OfficialSignatureStampBlock compact={true} /></div>
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

export default Template1CurveBlue;
