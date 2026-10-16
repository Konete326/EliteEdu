import { Building2 } from 'lucide-react';

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
    <div className="relative pb-4 border-b-2 border-ink dark:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#141414] border border-line dark:border-white/10 flex items-center justify-center font-bold text-lg shadow-sm print:border print:border-black shrink-0 overflow-hidden p-1">
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full rounded-xl bg-primary text-white flex items-center justify-center">
                <Building2 className="w-6 h-6" />
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

        <div className="w-24 h-28 rounded-xl border-2 border-dashed border-line dark:border-white/20 bg-surface-secondary/40 dark:bg-[#16161d] flex flex-col items-center justify-center overflow-hidden shrink-0 print:border-solid print:border-black">
          {student?.photo_url ? (
            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-1">
              <span className="text-xl font-bold text-ink-muted">{initials}</span>
              <span className="block text-[8px] uppercase font-bold text-ink-muted mt-1 leading-tight">
                Passport Photo
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary text-white print:bg-black print:text-white">
          Admission Letter & Student Record
        </span>
      </div>
    </div>
  );
};

export default AdmissionFormHeader;
