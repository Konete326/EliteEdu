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

const AdmissionLetterBody = ({ student }) => {
  const school = student?.school_id || {};
  const campus = student?.campus_id || {};
  const schoolName = school.name || campus.name || 'Elite Education System';
  const gradeName = student?.current_grade?.name || 'Class';
  const sectionName = student?.current_section || 'A';
  const session = student?.academic_session || '2026-2027';
  const stream = student?.elective_stream && student.elective_stream !== 'None' ? student.elective_stream : 'General Academics';

  const feeAmount = student?.monthly_fee ? Number(student.monthly_fee).toLocaleString() : '15,000';
  const admDate = student?.admission_date ? new Date(student.admission_date) : new Date();
  const dueDate = new Date(admDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const dueDayStr = dueDate.toLocaleDateString('en-GB', { weekday: 'long' });
  const dueFormatted = `${dueDayStr}, ${formatOrdinalDate(dueDate)}`;

  return (
    <div className="space-y-3 text-[11px] sm:text-xs text-black leading-relaxed font-serif">
      <div className="text-center pt-1 pb-1">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider underline underline-offset-4 decoration-black">
          OFFER OF PROVISIONAL ADMISSION INTO {gradeName.toUpperCase()}
          <span className="block font-bold text-[11px] sm:text-xs mt-0.5">
            ({session} ACADEMIC SESSION)
          </span>
        </h3>
      </div>

      <p className="text-justify leading-relaxed">
        With reference to your application for admission into <span className="font-bold">{schoolName}</span>, I am
        pleased to inform you that you have been offered provisional admission to pursue an academic programme leading
        to the completion of <span className="font-bold">{gradeName} (Section {sectionName})</span> in the Department of{' '}
        <span className="font-bold underline decoration-black/60">{stream}</span> with effect from the{' '}
        <span className="font-bold">{session}</span> Session.
      </p>

      <p className="font-semibold text-black/90">
        Please take note of the following conditions, which are related to your admission and registration:
      </p>

      <div className="space-y-2 text-justify pl-1">
        <div>
          <p className="font-bold">(1) This offer of admission is strictly provisional and may be revoked if :</p>
          <div className="pl-6 space-y-1 mt-1 text-black/90">
            <p>
              (a) you fail to formally accept this offer by paying the admission &amp; tuition dues of{' '}
              <span className="font-bold">PKR {feeAmount}</span>, and associated registration charges.
            </p>
            <p>(b) you are unable to satisfy the necessary criteria for academic admission and verification.</p>
            <p>
              (c) you cannot produce at the time of registration, the original copies of birth certificate / B-Form,
              previous School Leaving Certificate (SLC), and verified academic credentials.
            </p>
          </div>
        </div>

        <div>
          <p className="font-bold">
            (2) The programme is on <span className="underline decoration-black">Regular / Full-Time basis</span>.
          </p>
          <p className="pl-6 text-black/90">
            The duration of your academic session and other institutional conditions relating to conduct and discipline
            are as contained in the student handbook and institutional prospectus.
          </p>
        </div>

        <p>
          <span className="font-bold">(3)</span> The attached information and challan voucher on fees payable is for your
          immediate compliance.
        </p>

        <p>
          <span className="font-bold">(4)</span> If you accept this offer, kindly collect the official admission docket
          and uniform guidelines from the campus administration office.
        </p>

        <p>
          <span className="font-bold">(5)</span> Please note that the student&rsquo;s name and registration number (
          <span className="font-mono font-bold">{student?.gr_number || '—'}</span>) should be boldly written in the
          space provided for depositor in the bank teller / challan receipt.
        </p>

        <p>
          <span className="font-bold">(6)</span> Payment of all admission dues must be made not later than{' '}
          <span className="font-bold underline decoration-black">{dueFormatted}</span> as this provisional offer of
          admission will lapse thereafter.
        </p>

        <p>
          <span className="font-bold">(7)</span> It is mandatory for you to attend the new student induction assembly and
          orientation programme prior to regular classes. Failure to attend without prior approval may lead to
          cancellation of admission.
        </p>

        <p>
          <span className="font-bold">(8)</span> Please note that if it is discovered at any time that you do not possess
          any of the academic qualifications or submitted fraudulent documents, the admission will be withdrawn
          immediately.
        </p>
      </div>

      <p className="pt-1 text-justify font-medium">
        Please accept our warmest congratulations on behalf of the administration and faculty of the school.
      </p>
    </div>
  );
};

export default AdmissionLetterBody;
