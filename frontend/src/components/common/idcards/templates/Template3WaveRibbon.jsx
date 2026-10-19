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

const addYears = (d, y) => {
  if (!d) return '';
  const dt = new Date(d);
  dt.setFullYear(dt.getFullYear() + y);
  return fmtDate(dt);
};

const WaveHeader = ({ color }) => (
  <div className="relative shrink-0" style={{ height: 72 }}>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 248 72" preserveAspectRatio="none">
      <path d="M0,0 L248,0 L248,50 Q186,72 124,58 Q62,44 0,64 Z" fill={color} opacity="0.6" />
      <path d="M0,0 L248,0 L248,42 Q186,64 124,50 Q62,36 0,56 Z" fill={color} />
    </svg>
  </div>
);

const FrontCard = ({ holder, holderType, accentColor, institution, isSelected, onToggleSelect }) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? holder.gr_number : holder.employee_code;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const rows = isStudent
    ? [{ label: 'ID', value: holder.gr_number }, { label: 'Class', value: holder.current_grade?.name }, { label: 'DOA', value: fmtDate(holder.date_of_admission) }, { label: 'Phone', value: holder.parent_phone }]
    : [{ label: 'ID', value: holder.employee_code }, { label: 'Role', value: holder.designation }, { label: 'DOJ', value: fmtDate(holder.date_of_joining) }, { label: 'CNIC', value: holder.cnic }];
  return (
    <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <WaveHeader color={accentColor} />
      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 z-10"><IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={60} ringColor={accentColor} ringWidth={2} /></div>
      <div className="flex flex-col items-center px-3 pt-10 pb-2 gap-1 flex-1">
        <span className="font-extrabold text-[10px] uppercase text-center" style={{ color: accentColor }}>{holder.name}</span>
        <span className="text-[7px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>{isStudent ? '🎓 STUDENT' : holder.designation || 'STAFF'}</span>
        <div className="w-full mt-1"><IdCardDataRows rows={rows} /></div>
        <div className="w-full flex justify-center mt-1" style={{ color: accentColor }}>{renderSvgBarcode(codeVal, 200, 20)}</div>
        <div className="flex items-center justify-between w-full pt-1">
          <OfficialSignatureStampBlock compact={true} />
          <div>{renderSvgQrCode(verifyUrl, 38)}</div>
        </div>
      </div>
      <div className="h-1.5 w-full mt-auto" style={{ background: accentColor }} />
      <span className="absolute bottom-2 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

const BackCard = ({ holder, holderType, institution }) => (
  <div className="relative flex flex-col rounded-xl overflow-hidden shadow-md w-[248px] min-h-[390px] bg-white p-3 gap-2">
    <p className="font-extrabold text-[8px] uppercase text-center text-slate-700 tracking-widest border-b border-slate-200 pb-1">STAFF / STUDENT IDENTITY CARD</p>
    <IdCardInstHeader {...institution} textColor="#1e293b" bgColor="transparent" />
    <div className="text-[7.5px] flex flex-col gap-1 flex-1 text-slate-700">
      <div className="flex justify-between"><span className="font-semibold text-slate-500">JOINED</span><span>{fmtDate(holder.date_of_joining || holder.date_of_admission)}</span></div>
      <div className="flex justify-between"><span className="font-semibold text-slate-500">EXPIRES</span><span>{addYears(holder.date_of_joining || holder.date_of_admission, 3)}</span></div>
      {holder.cnic && <div className="flex justify-between"><span className="font-semibold text-slate-500">CNIC</span><span>{holder.cnic}</span></div>}
      <div className="mt-2 p-1.5 rounded bg-slate-50 border border-slate-200 text-[7px] text-center text-slate-500">
        IF FOUND PLEASE RETURN TO<br /><strong className="text-slate-700">{institution.institutionName || 'THE INSTITUTION'}</strong>
      </div>
    </div>
    <OfficialSignatureStampBlock compact={true} />
    <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
  </div>
);

const Template3WaveRibbon = ({ holder = {}, holderType = 'student', orientation = 'vertical', accentColor = '#0284C7', institution = {}, isSelected, onToggleSelect, sideMode = 'front' }) => {
  if (sideMode === 'both') {
    return (
      <div className="flex flex-row gap-2">
        <FrontCard holder={holder} holderType={holderType} accentColor={accentColor} institution={institution} isSelected={isSelected} onToggleSelect={onToggleSelect} />
        <BackCard holder={holder} holderType={holderType} institution={institution} />
      </div>
    );
  }
  if (sideMode === 'back') return <BackCard holder={holder} holderType={holderType} institution={institution} />;
  return <FrontCard holder={holder} holderType={holderType} accentColor={accentColor} institution={institution} isSelected={isSelected} onToggleSelect={onToggleSelect} />;
};

export default Template3WaveRibbon;
