import { Building2 } from 'lucide-react';

const AdmissionLetterHeader = ({ student, template }) => {
  const school = student?.school_id || {};
  const campus = student?.campus_id || {};

  const schoolName = (school.name || campus.name || '').toUpperCase();
  const campusName = campus.name ? `${campus.name.toUpperCase()} CAMPUS` : '';
  const logoUrl = school.logo_url || campus.logo;
  const address = campus.address || school.address || '';
  const phone = campus.contact_number || school.contact_number || '';
  const email = campus.email || school.email || '';
  const website = campus.website || school.website || '';
  const affiliation = school.affiliation_number ? `Affiliation No: ${school.affiliation_number}` : '';
  const principalName = template?.signatory_name || school.principal_name || '';
  const officeTitle = template?.header_office_title || 'Office of the Principal';

  const hasLeftMeta = Boolean(principalName || affiliation);
  const hasRightMeta = Boolean(address || phone || email || website);
  const hasMetaSection = hasLeftMeta || hasRightMeta;

  return (
    <div className="relative pb-3 border-b-2 border-black">
      <div className="flex items-start justify-between gap-4">
        {logoUrl ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center p-1">
            <img src={logoUrl} alt={schoolName || 'School'} className="w-full h-full object-contain" />
          </div>
        ) : schoolName ? (
          <div className="w-14 h-14 rounded-xl border border-black/40 flex items-center justify-center bg-black/5 text-black shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
        ) : null}

        <div className="flex-1 text-center px-2">
          {Boolean(schoolName) && (
            <h1 className="text-base sm:text-xl font-serif font-black tracking-tight text-black uppercase leading-tight">
              {schoolName}
            </h1>
          )}
          {Boolean(campusName) && (
            <p className="text-[11px] sm:text-xs font-bold tracking-wider text-black/80 uppercase mt-0.5">
              DIVISION OF ACADEMIC AFFAIRS &amp; ADMISSIONS • {campusName}
            </p>
          )}
          {Boolean(officeTitle) && (
            <div className="mt-1 pt-1 border-t border-black/30 inline-block px-6">
              <h2 className="text-xs sm:text-sm font-serif font-bold text-black tracking-wide">
                {officeTitle}
              </h2>
            </div>
          )}
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
          <div className="w-2 shrink-0" />
        )}
      </div>

      {hasMetaSection && (
        <div className="mt-3 pt-2 border-t border-black/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-black">
          <div className="space-y-0.5">
            {Boolean(principalName) && (
              <p className="font-bold">
                <span className="font-semibold text-black/70">Principal / Head:</span> {principalName}
              </p>
            )}
            {Boolean(affiliation) && (
              <p className="text-black/80 italic">{affiliation}</p>
            )}
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-black/80">
            {Boolean(address) && <p className="truncate font-medium">{address}</p>}
            {(Boolean(phone) || Boolean(email)) && (
              <p className="font-medium">
                {Boolean(phone) && <span><span className="font-semibold text-black/90">Tel:</span> {phone} </span>}
                {Boolean(phone && email) && <span>• </span>}
                {Boolean(email) && <span><span className="font-semibold text-black/90">Email:</span> {email}</span>}
              </p>
            )}
            {Boolean(website) && (
              <p className="font-medium">
                <span className="font-semibold text-black/90">Website:</span> {website}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionLetterHeader;
