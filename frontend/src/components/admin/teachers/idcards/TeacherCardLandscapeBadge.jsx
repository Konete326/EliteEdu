import { renderSvgBarcode } from '../../../../utils/idCardCodeGenerator';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { Sparkles, GraduationCap } from 'lucide-react';

const TeacherCardLandscapeBadge = ({ teacher, config = {} }) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolLogo = school?.logo_url || userSchool?.school_logo || campus?.logo || '/logo.png';
  const schoolName = (school?.name || userSchool?.school_name || campus?.name || 'CAMPUS SYSTEM').toUpperCase();
  const persId = teacher.personal_id || teacher.employee_code || '—';
  const barcodeVal = teacher.personal_id || teacher.employee_code || teacher._id?.slice(-8) || '00000000';

  return (
    <div className="w-full max-w-[94mm] h-[58mm] bg-white dark:bg-[#0c0c0f] text-black dark:text-white rounded-xl border-2 border-teal-600/40 shadow-sm overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-black/30 print:bg-white print:text-black shrink-0 select-none text-[10px]">
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white px-2.5 py-1.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center p-0.5 shrink-0">
            <img src={schoolLogo} alt="" className="w-4 h-4 object-contain" />
          </div>
          <div className="min-w-0 leading-tight">
            <h4 className="font-black text-[9px] uppercase tracking-wide truncate">{schoolName}</h4>
            <span className="text-[7px] text-teal-100 uppercase tracking-wider">Academic Staff Pass</span>
          </div>
        </div>
        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white text-teal-800 text-[7px] font-black uppercase shadow-2xs">
          <Sparkles className="w-2.5 h-2.5 text-teal-600" /> FACULTY
        </span>
      </div>

      <div className="p-2 flex-1 flex gap-2.5 relative">
        <div className="w-[24mm] flex flex-col items-center justify-between shrink-0 z-10">
          <div className="w-[22mm] h-[26mm] rounded-xl border-2 border-teal-500/50 bg-teal-50/50 overflow-hidden shadow-2xs">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-teal-600">PHOTO</div>
            )}
          </div>
          <div className="mt-1 text-black dark:text-white print:text-black">
            {renderSvgBarcode(barcodeVal, 68, 12)}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between z-10 min-w-0 pr-1 text-[8px]">
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-black uppercase text-teal-950 dark:text-teal-200 truncate">{teacher.name}</h3>
            <p className="text-[7.5px] font-bold text-slate-500 uppercase">S/O: {teacher.father_name || '—'}</p>
            <div className="pt-0.5 flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 font-bold text-[7px] uppercase">
                {teacher.designation || 'Staff'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[7px]">
                {persId}
              </span>
            </div>
            <p className="text-[7.5px] text-slate-500 font-mono pt-0.5">CNIC: {teacher.cnic || '—'}</p>
          </div>

          <div className="flex items-end justify-between pt-1 border-t border-teal-100 dark:border-teal-900/50">
            <OfficialSignatureStampBlock compact={true} showStamp={true} signatureTitle="Registrar" stampTitle="Official" />
            <div className="flex items-center gap-0.5 text-[6.5px] font-bold text-slate-400 select-none pb-0.5">
              <GraduationCap className="w-2.5 h-2.5 text-teal-600" />
              <span>EliteEdu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCardLandscapeBadge;
