import { HeartPulse, PhoneCall, ShieldAlert, Building2 } from 'lucide-react';

const EmergencyMedicalCard = ({ emergency = {}, institution = {} }) => {
  const bloodGroup = emergency.blood_group || 'Not Specified';
  const condition = emergency.disease_if_any || 'None';
  const mark = emergency.identification_mark || 'Nil';
  const emergencyPhone = emergency.emergency_contact_no || '';
  const campusPhone = institution.campus_phone || '';

  return (
    <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 dark:bg-red-950/20 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <HeartPulse className="w-5 h-5 shrink-0 animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-wider">Emergency & Medical Particulars</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#141418] border border-red-500/20 rounded-xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase text-ink-muted block">Blood Group</span>
          <span className="text-lg font-black text-red-600 dark:text-red-400">{bloodGroup}</span>
        </div>
        <div className="bg-white dark:bg-[#141418] border border-line dark:border-line-dark rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-ink-muted block">Medical Notes / Allergies</span>
          <span className="text-xs font-bold text-ink dark:text-ink-dark truncate block mt-0.5">{condition}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#141418] border border-line dark:border-line-dark rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-ink-muted block">Identification Mark</span>
          <span className="text-xs font-bold text-ink dark:text-ink-dark truncate block mt-0.5">{mark}</span>
        </div>
      </div>

      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {emergencyPhone && emergencyPhone !== 'Not Specified' ? (
          <a
            href={`tel:${emergencyPhone}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>Call Guardian: {emergencyPhone}</span>
          </a>
        ) : (
          <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-secondary text-ink-muted text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Guardian Phone Not Listed</span>
          </div>
        )}

        {campusPhone && (
          <a
            href={`tel:${campusPhone}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition-colors"
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Call School: {campusPhone}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default EmergencyMedicalCard;
