const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatOrdinalDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '—';
  const day = getOrdinal(d.getDate());
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

const AdmissionLetterRecipient = ({ student }) => {
  const campusCode = student?.campus_id?.code || student?.campus_id?.name?.slice(0, 3)?.toUpperCase() || 'EGS';
  const session = student?.academic_session || '2026-2027';
  const refStr = `${campusCode}/ADM/${session.replace(/\s+/g, '')}/${student?.gr_number || 'REG-001'}`;
  const dateStr = formatOrdinalDate(student?.admission_date || new Date());
  const gradeName = student?.current_grade?.name || 'Class';
  const sectionName = student?.current_section || 'A';

  return (
    <div className="space-y-3.5 text-xs text-black">
      <div className="flex items-center justify-between text-xs sm:text-sm font-serif">
        <p className="font-semibold">
          <span className="font-bold text-black/70 mr-1.5">Ref:</span>
          <span className="font-mono font-bold tracking-tight">{refStr}</span>
        </p>
        <p className="font-semibold">
          <span className="font-bold text-black/70 mr-1.5">Date:</span>
          <span className="font-medium">{dateStr}</span>
        </p>
      </div>

      <div className="space-y-1 pt-1">
        <div className="border-b-2 border-black inline-block pb-0.5 min-w-[240px] sm:min-w-[320px]">
          <span className="text-sm sm:text-base font-serif font-black tracking-wide uppercase text-black">
            {student?.name || 'STUDENT NAME'}
          </span>
          {student?.father_name && (
            <span className="text-xs font-serif font-medium text-black/80 ml-2">
              (S/O, D/O {student.father_name})
            </span>
          )}
        </div>

        <div>
          <div className="border-b-2 border-black inline-block pb-0.5 min-w-[200px] sm:min-w-[280px]">
            <span className="font-mono font-black text-xs sm:text-sm text-black tracking-wider">
              REG / ROLL NO: {student?.gr_number || '—'}
            </span>
          </div>
        </div>

        <div className="pt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/85">
          <p>
            <span className="font-bold">Admitted Into:</span>{' '}
            <span className="font-semibold uppercase">{gradeName} (Section {sectionName})</span>
          </p>
          {student?.b_form && (
            <p>
              <span className="font-bold">B-Form / CNIC:</span>{' '}
              <span className="font-mono">{student.b_form}</span>
            </p>
          )}
        </div>

        <p className="text-xs sm:text-sm font-serif font-bold text-black pt-2">
          Dear Sir/Madam &amp; Respected Parents,
        </p>
      </div>
    </div>
  );
};

export default AdmissionLetterRecipient;
