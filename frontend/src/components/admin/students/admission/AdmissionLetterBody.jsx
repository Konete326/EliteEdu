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

const replaceTokens = (text, tokens) => {
  if (!text) return '';
  return text
    .replace(/\{\{school_name\}\}/gi, tokens.schoolName)
    .replace(/\{\{grade\}\}/gi, tokens.gradeName)
    .replace(/\{\{section\}\}/gi, tokens.sectionName)
    .replace(/\{\{session\}\}/gi, tokens.session)
    .replace(/\{\{stream\}\}/gi, tokens.stream)
    .replace(/\{\{student_name\}\}/gi, tokens.studentName)
    .replace(/\{\{father_name\}\}/gi, tokens.fatherName)
    .replace(/\{\{gr_number\}\}/gi, tokens.grNumber)
    .replace(/\{\{fee_amount\}\}/gi, tokens.feeAmount)
    .replace(/\{\{due_date\}\}/gi, tokens.dueFormatted);
};

const AdmissionLetterBody = ({ student, template }) => {
  const school = student?.school_id || {};
  const campus = student?.campus_id || {};
  const schoolName = school.name || campus.name || 'School Administration';
  const gradeName = student?.current_grade?.name || 'Class';
  const sectionName = student?.current_section || 'A';
  const session = student?.academic_session || '2026-2027';
  const stream = student?.elective_stream && student.elective_stream !== 'None' ? student.elective_stream : 'General Academics';

  const feeAmount = student?.monthly_fee ? Number(student.monthly_fee).toLocaleString() : '15,000';
  const admDate = student?.admission_date ? new Date(student.admission_date) : new Date();
  const dueDays = template?.fee_due_days || 14;
  const dueDate = new Date(admDate.getTime() + dueDays * 24 * 60 * 60 * 1000);
  const dueDayStr = dueDate.toLocaleDateString('en-GB', { weekday: 'long' });
  const dueFormatted = `${dueDayStr}, ${formatOrdinalDate(dueDate)}`;

  const tokens = {
    schoolName,
    gradeName,
    sectionName,
    session,
    stream,
    studentName: student?.name || '',
    fatherName: student?.father_name || '',
    grNumber: student?.gr_number || '',
    feeAmount,
    dueFormatted
  };

  const subjectText = template?.subject_format
    ? replaceTokens(template.subject_format, tokens)
    : `OFFER OF PROVISIONAL ADMISSION INTO ${gradeName.toUpperCase()} (${session} ACADEMIC SESSION)`;

  const openingText = template?.opening_text
    ? replaceTokens(template.opening_text, tokens)
    : `With reference to your application for admission into ${schoolName}, I am pleased to inform you that you have been offered provisional admission to pursue an academic programme leading to the completion of ${gradeName} (Section ${sectionName}) in the Department of ${stream} with effect from the ${session} Session.`;

  const subClauses = template?.sub_clauses_revocation?.length
    ? template.sub_clauses_revocation
    : [
        'you fail to formally accept this offer by paying the admission & tuition dues of PKR {{fee_amount}}, and associated registration charges.',
        'you are unable to satisfy the necessary criteria for academic admission and verification.',
        'you cannot produce at the time of registration, the original copies of birth certificate / B-Form, previous School Leaving Certificate (SLC), and verified academic credentials.'
      ];

  const conditions = template?.conditions?.length
    ? template.conditions
    : [
        'The programme is on Regular / Full-Time basis. The duration of your academic session and other institutional conditions relating to conduct and discipline are as contained in the student handbook and institutional prospectus.',
        'The attached information and challan voucher on fees payable is for your immediate compliance.',
        'If you accept this offer, kindly collect the official admission docket and uniform guidelines from the campus administration office.',
        'Please note that the student’s name and registration number ({{gr_number}}) should be boldly written in the space provided for depositor in the bank teller / challan receipt.',
        'Payment of all admission dues must be made not later than {{due_date}} as this provisional offer of admission will lapse thereafter.',
        'It is mandatory for you to attend the new student induction assembly and orientation programme prior to regular classes. Failure to attend without prior approval may lead to cancellation of admission.',
        'Please note that if it is discovered at any time that you do not possess any of the academic qualifications or submitted fraudulent documents, the admission will be withdrawn immediately.'
      ];

  const closingText = template?.closing_text
    ? replaceTokens(template.closing_text, tokens)
    : 'Please accept our warmest congratulations on behalf of the administration and faculty of the school.';

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  return (
    <div className="space-y-3 text-[11px] sm:text-xs text-black leading-relaxed font-serif">
      <div className="text-center pt-1 pb-1">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider underline underline-offset-4 decoration-black">
          {subjectText}
        </h3>
      </div>

      <p className="text-justify leading-relaxed">{openingText}</p>

      <p className="font-semibold text-black/90">
        Please take note of the following conditions, which are related to your admission and registration:
      </p>

      <div className="space-y-2 text-justify pl-1">
        <div>
          <p className="font-bold">(1) This offer of admission is strictly provisional and may be revoked if :</p>
          <div className="pl-6 space-y-1 mt-1 text-black/90">
            {subClauses.map((sub, idx) => (
              <p key={idx}>
                ({letters[idx] || idx + 1}) {replaceTokens(sub, tokens)}
              </p>
            ))}
          </div>
        </div>

        {conditions.map((cond, idx) => (
          <p key={idx}>
            <span className="font-bold">({idx + 2})</span> {replaceTokens(cond, tokens)}
          </p>
        ))}
      </div>

      <p className="pt-1 text-justify font-medium">{closingText}</p>
    </div>
  );
};

export default AdmissionLetterBody;
