import { Building2 } from 'lucide-react';

const AdmissionLetterHeader = ({ student }) => {
  const school = student?.school_id || {};
  const campus = student?.campus_id || {};

  const schoolName = (school.name || campus.name || 'ELITE EDUCATION SYSTEM').toUpperCase();
  const campusName = campus.name ? `${campus.name.toUpperCase()} CAMPUS` : 'MAIN CAMPUS';
  const logoUrl = school.logo_url || campus.logo;
  const address = campus.address || school.address || 'Gulshan-e-Iqbal, Karachi, Pakistan';
  const phone = campus.contact_number || school.contact_number || '+92 300 1234567';
  const email = campus.email || school.email || 'admissions@eliteedu.pk';
  const website = campus.website || school.website || 'https://eliteedu.pk';
  const affiliation = school.affiliation_number ? `Affiliation No: ${school.affiliation_number}` : 'Affiliated with Board of Secondary Education';

  return (
    <div className="relative pb-3 border-b-2 border-black">
      <div className="flex items-start justify-between gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center p-1">
          {logoUrl ? (
            <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
          ) : (
            <div className="w-16 h-16 rounded-xl border border-black/40 flex items-center justify-center bg-black/5 text-black">
              <Building2 className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center px-2">
          <h1 className="text-base sm:text-xl font-serif font-black tracking-tight text-black uppercase leading-tight">
            {schoolName}
          </h1>
          <p className="text-[11px] sm:text-xs font-bold tracking-wider text-black/80 uppercase mt-0.5">
            DIVISION OF ACADEMIC AFFAIRS &amp; ADMISSIONS • {campusName}
          </p>
          <div className="mt-1 pt-1 border-t border-black/30 inline-block px-6">
            <h2 className="text-xs sm:text-sm font-serif font-bold text-black tracking-wide">
              Office of the Principal
            </h2>
          </div>
        </div>

        {student?.photo_url ? (
          <div className="w-20 h-24 sm:w-22 sm:h-26 shrink-0 border border-black p-0.5 bg-white shadow-2xs">
            <img
              src={student.photo_url}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-4 shrink-0" />
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-black/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-black">
        <div className="space-y-0.5">
          <p className="font-bold">
            <span className="font-semibold text-black/70">Principal / Head:</span> Prof. Muhammad Tariq
          </p>
          <p className="text-black/80 italic">{affiliation}</p>
        </div>

        <div className="text-left sm:text-right space-y-0.5 text-black/80">
          <p className="truncate font-medium">{address}</p>
          <p className="font-medium">
            <span className="font-semibold text-black/90">Tel:</span> {phone} • <span className="font-semibold text-black/90">Email:</span> {email}
          </p>
          <p className="font-medium">
            <span className="font-semibold text-black/90">Website:</span> {website}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionLetterHeader;
