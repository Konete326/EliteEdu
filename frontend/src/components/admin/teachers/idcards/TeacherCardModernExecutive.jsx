import { renderSvgBarcode } from '../../../../utils/idCardCodeGenerator';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { Award, GraduationCap } from 'lucide-react';

const TeacherCardModernExecutive = ({ teacher, config = {} }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolLogo = school?.logo_url || userSchool?.school_logo || campus?.logo || '/logo.png';
  const schoolName = (school?.name || userSchool?.school_name || campus?.name || 'INSTITUTION').toUpperCase();
  const persId = teacher.personal_id || teacher.employee_code || '—';
  const barcodeVal = teacher.personal_id || teacher.employee_code || teacher._id?.slice(-8) || '00000000';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border-2 border-indigo-900/40 shadow-sm overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[10px]">
      <div className="bg-slate-900 text-white px-2.5 py-1.5 flex items-center justify-between shrink-0 border-b-2 border-amber-500">
        <div className="flex items-center gap-1.5 min-w-0">
          <img src={schoolLogo} alt="" className="w-5 h-5 object-contain rounded bg-white/10 p-0.5" />
          <div className="leading-tight min-w-0">
            <p className="font-black text-[9px] tracking-wide uppercase truncate text-amber-400">{schoolName}</p>
            <p className="text-[7px] text-slate-300 uppercase tracking-widest truncate">Faculty & Staff Card</p>
          </div>
        </div>
        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
          <Award className="w-2.5 h-2.5" /> EXECUTIVE
        </span>
      </div>

      <div className="p-2 flex-1 flex gap-2.5 relative">
        <div className="w-[24mm] flex flex-col items-center justify-between shrink-0 z-10">
          <div className="w-[22mm] h-[26mm] rounded-lg border-2 border-amber-500/60 bg-slate-50 overflow-hidden shadow-xs">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-xs text-slate-400">PHOTO</div>
            )}
          </div>
          <div className="mt-1 text-black dark:text-white print:text-black">
            {renderSvgBarcode(barcodeVal, 68, 12)}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between z-10 min-w-0 pr-1 text-[8.5px]">
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black uppercase text-indigo-950 dark:text-indigo-300 truncate">{teacher.name}</h4>
            <p className="text-[7.5px] font-bold text-slate-500 uppercase">S/O: {teacher.father_name || '—'}</p>
            <div className="pt-1 flex flex-wrap items-center gap-1">
              <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black text-[7.5px] uppercase">
                {teacher.designation || 'Instructor'}
              </span>
              {teacher.bps_grade && (
                <span className="px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-[7.5px]">
                  BPS-{teacher.bps_grade}
                </span>
              )}
            </div>
            <p className="text-[7.5px] font-mono pt-0.5"><span className="text-slate-400">CNIC:</span> <strong>{teacher.cnic || '—'}</strong></p>
          </div>

          <div className="flex items-end justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
            <OfficialSignatureStampBlock compact={true} showStamp={true} signatureTitle="Director" stampTitle="Official" />
            <div className="flex items-center gap-0.5 text-[6.5px] font-bold text-slate-400 select-none pb-0.5">
              <GraduationCap className="w-2.5 h-2.5 text-amber-600" />
              <span>EliteEdu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardModernExecutive;
