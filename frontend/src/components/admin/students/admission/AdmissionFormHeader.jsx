import { Building2, User } from 'lucide-react';

const AdmissionFormHeader = ({ student }) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  const schoolName = school.name || campus.name || 'INSTITUTIONAL CAMPUS';
  const logoUrl = school.logo_url || campus.logo;
  const slogan = school.slogan || '';
  const phone = campus.contact_number || school.contact_number || '';
  const address = campus.address || school.address || '';
  const website = campus.website || school.website || '';
  const contactParts = [phone, address, website].filter(Boolean).join(' | ');
  const initials = student?.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';

  return (
    <div className="relative pb-3 border-b-2 border-ink dark:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-xl bg-white dark:bg-[#141414] border border-line dark:border-white/10 flex items-center justify-center font-bold text-lg shadow-sm print:border print:border-black shrink-0 overflow-hidden p-1">
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full rounded-lg bg-primary text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-black text-ink dark:text-ink-dark uppercase tracking-tight">
              {schoolName}
            </h1>
            {Boolean(slogan) && (
              <p className="text-xs font-semibold text-primary dark:text-primary-dark font-urdu">
                {slogan}
              </p>
            )}
            {Boolean(contactParts) && (
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
                {contactParts}
              </p>
            )}
          </div>
        </div>

        <div className="w-20 h-24 rounded-xl border border-line dark:border-white/20 bg-surface-secondary/40 dark:bg-[#16161d] flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-xs print:border print:border-black">
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-primary-soft/30 dark:bg-primary/10">
              <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-0.5 font-bold text-xs">
                {initials}
              </div>
              <span className="text-[7.5px] uppercase font-bold text-ink-muted tracking-tight">Photo</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="inline-block px-3.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary text-white print:bg-black print:text-white">
          Admission Letter & Student Record
        </span>
      </div>
    </div>
  );
};

export default AdmissionFormHeader;
