import { renderSvgBarcode, renderSvgQrCode, generateStudentVerifyUrl, generateStaffVerifyUrl } from '../../../../utils/idCardCodeGenerator.jsx';
import OfficialSignatureStampBlock from '../../OfficialSignatureStampBlock.jsx';
import IdCardPhotoAvatar from '../IdCardPhotoAvatar.jsx';
import IdCardDataRows from '../IdCardDataRows.jsx';
import IdCardInstHeader from '../IdCardInstHeader.jsx';

const fmtDate = (d) => (!d ? '' : isNaN(new Date(d)) ? d : `${String(new Date(d).getMonth() + 1).padStart(2, '0')}/${new Date(d).getFullYear()}`);
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

const FrontCard = ({ holder, holderType, orientation, accentColor, institution, isSelected, onToggleSelect }) => {
  const isStudent = holderType === 'student';
  const codeVal = isStudent ? holder.gr_number : holder.employee_code;
  const verifyUrl = isStudent ? generateStudentVerifyUrl(holder) : generateStaffVerifyUrl(holder);
  const rows = isStudent
    ? [{ label: 'ID', value: holder.gr_number }, { label: 'Class', value: holder.current_grade?.name }, { label: 'DOA', value: fmtDate(holder.date_of_admission) }, { label: 'Phone', value: holder.parent_phone }]
    : [{ label: 'ID', value: holder.employee_code }, { label: 'Role', value: holder.designation }, { label: 'DOJ', value: fmtDate(holder.date_of_joining) }, { label: 'CNIC', value: holder.cnic }];
  const badge = isStudent ? '🎓 STUDENT' : holder.designation || 'STAFF';

  if (orientation === 'horizontal') {
    return (
      <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[380px] h-[235px] shrink-0 bg-white select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="relative px-2.5 py-1 flex items-center justify-between shrink-0" style={{ background: accentColor }}>
          <IdCardInstHeader {...institution} textColor="white" compact={true} bgColor="transparent" />
          <span className="text-[7px] font-bold px-2 py-0.5 rounded-full text-white bg-white/20 tracking-wider shrink-0">{badge}</span>
        </div>
        <div className="flex flex-1 px-3 py-1.5 gap-3 items-center">
          <IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={64} ringColor={accentColor} ringWidth={2} />
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
            <div className="w-full flex justify-center py-0.5" style={{ color: accentColor }}>{renderSvgBarcode(codeVal, 140, 15)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-1 border-t border-slate-200 mt-auto bg-slate-50/70">
          <OfficialSignatureStampBlock compact={true} />
          <div className="shrink-0">{renderSvgQrCode(verifyUrl, 32)}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onToggleSelect} className={`relative flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer w-[248px] min-h-[390px] bg-white select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <WaveHeader color={accentColor} />
      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 z-10"><IdCardPhotoAvatar photoUrl={holder.photo_url} name={holder.name} size={60} ringColor={accentColor} ringWidth={2} /></div>
      <div className="flex flex-col items-center px-3 pt-10 pb-2 gap-1 flex-1">
        <span className="font-extrabold text-[10px] uppercase text-center" style={{ color: accentColor }}>{holder.name}</span>
        <span className="text-[7px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>{badge}</span>
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

const BackCard = ({ holder, institution, orientation = 'vertical' }) => {
  const isHoriz = orientation === 'horizontal';
  return (
    <div className={`relative flex flex-col justify-between rounded-xl overflow-hidden shadow-md bg-white p-3 gap-1 select-none ${isHoriz ? 'w-[380px] h-[235px] shrink-0' : 'w-[248px] min-h-[390px]'}`}>
      <p className="font-extrabold text-[8px] uppercase text-center text-slate-700 tracking-widest border-b border-slate-200 pb-1">IDENTITY CARD</p>
      <IdCardInstHeader {...institution} textColor="#1e293b" bgColor="transparent" compact={isHoriz} />
      <div className="text-[7.5px] flex flex-col gap-1 text-slate-700">
        <div className="flex justify-between"><span className="font-semibold text-slate-500">JOINED</span><span>{fmtDate(holder.date_of_joining || holder.date_of_admission)}</span></div>
        <div className="flex justify-between"><span className="font-semibold text-slate-500">EXPIRES</span><span>{addYears(holder.date_of_joining || holder.date_of_admission, 3)}</span></div>
        {holder.cnic && <div className="flex justify-between"><span className="font-semibold text-slate-500">CNIC</span><span>{holder.cnic}</span></div>}
      </div>
      <div className="p-1 rounded bg-slate-50 border border-slate-200 text-[6.5px] text-center text-slate-500">
        IF FOUND PLEASE RETURN TO <strong className="text-slate-700">{institution.institutionName || 'THE INSTITUTION'}</strong>
      </div>
      <OfficialSignatureStampBlock compact={true} />
      <span className="absolute bottom-1 right-1 text-[7px] font-bold tracking-widest opacity-30">EliteEdu</span>
    </div>
  );
};

const Template3WaveRibbon = ({ holder = {}, holderType = 'student', orientation = 'vertical', accentColor = '#0284C7', institution = {}, isSelected, onToggleSelect, sideMode = 'front' }) => {
  const props = { holder, holderType, orientation, accentColor, institution, isSelected, onToggleSelect };
  if (sideMode === 'both') {
    return (
      <div className={`flex flex-col ${orientation === 'horizontal' ? 'xl:flex-row' : 'sm:flex-row'} gap-3 items-center justify-center print:flex-row print:gap-3`}>
        <FrontCard {...props} />
        <BackCard holder={holder} institution={institution} orientation={orientation} />
      </div>
    );
  }
  if (sideMode === 'back') return <BackCard holder={holder} institution={institution} orientation={orientation} />;
  return <FrontCard {...props} />;
};

export default Template3WaveRibbon;
