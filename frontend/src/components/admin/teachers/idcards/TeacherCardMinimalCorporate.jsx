import { renderSvgBarcode } from '../../../../utils/idCardCodeGenerator';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { ShieldCheck, GraduationCap } from 'lucide-react';

const TeacherCardMinimalCorporate = ({ teacher, config = {} }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolLogo = school?.logo_url || userSchool?.school_logo || campus?.logo || '/logo.png';
  const schoolName = (school?.name || userSchool?.school_name || campus?.name || 'ORGANIZATION').toUpperCase();
  const persId = teacher.personal_id || teacher.employee_code || '—';
  const barcodeVal = teacher.personal_id || teacher.employee_code || teacher._id?.slice(-8) || '00000000';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-lg border-2 border-slate-800 dark:border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-black print:bg-white print:text-black shrink-0 select-none text-[10px]">
      <div className="border-b-2 border-slate-800 dark:border-slate-300 px-2.5 py-1.5 flex items-center justify-between shrink-0 bg-slate-100 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 min-w-0">
          <img src={schoolLogo} alt="" className="w-5 h-5 object-contain" />
          <div className="min-w-0">
            <h4 className="text-[9.5px] font-black tracking-tight uppercase truncate">{schoolName}</h4>
            <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">FACULTY CREDENTIAL</span>
          </div>
        </div>
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black text-[7px] font-mono font-black uppercase">
          <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
        </span>
      </div>

      <div className="p-2 flex-1 flex gap-2.5 relative">
        <div className="w-[24mm] flex flex-col items-center justify-between shrink-0 z-10">
          <div className="w-[22mm] h-[26mm] rounded border-2 border-black dark:border-white bg-slate-50 overflow-hidden">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono font-bold text-xs text-slate-400">STAFF</div>
            )}
          </div>
          <div className="mt-1 text-black dark:text-white print:text-black">
            {renderSvgBarcode(barcodeVal, 68, 12)}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between z-10 min-w-0 pr-1 text-[8px]">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase truncate">{teacher.name}</p>
            <p className="text-[7.5px] text-slate-500 font-bold uppercase">Father: {teacher.father_name || '—'}</p>
            <div className="border-l-2 border-black dark:border-white pl-1.5 my-0.5 space-y-0.5">
              <p className="font-bold text-[8px] uppercase">{teacher.designation || 'Lecturer'} {teacher.bps_grade ? `— BPS-${teacher.bps_grade}` : ''}</p>
              <p className="font-mono text-[7px] text-slate-500">ID: {persId} | CNIC: {teacher.cnic || '—'}</p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1 border-t border-slate-300 dark:border-slate-700">
            <OfficialSignatureStampBlock compact={true} showStamp={true} signatureTitle="Authority" stampTitle="Official" />
            <div className="flex items-center gap-0.5 text-[6.5px] font-bold text-slate-400 select-none pb-0.5">
              <GraduationCap className="w-2.5 h-2.5 text-black dark:text-white" />
              <span>EliteEdu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardMinimalCorporate;
