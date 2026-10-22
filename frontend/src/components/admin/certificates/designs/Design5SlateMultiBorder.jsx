import React from 'react';
import CertificateFooterBlock from '../CertificateFooterBlock';

const Design5SlateMultiBorder = ({
  certificateNo = 'CERT-2026-0001',
  template = {},
  school = {},
  campus = {},
  recipient = {},
  recipientType = 'Student',
  customText = '',
  customHeading = '',
  subHeading = '',
  customSlogan = '',
  customBody = '',
  resolvedBody = '',
  issueDate = new Date().toISOString().split('T')[0],
  orientation = 'landscape',
  signatoryTitle1 = 'Authorized Signatory',
  signatoryTitle2 = 'Principal / Head of Institution',
  showStamp = true,
  showQr = true
}) => {
  const schoolName = (school.name || campus.name || 'GAURAV PUBLIC SCHOOLS').toUpperCase();
  const sloganText = customSlogan !== undefined && customSlogan !== ''
    ? customSlogan
    : (campus.motto || school.slogan || 'Excellence in Education');
  const campusSub = [campus.name, sloganText].filter(Boolean).join(' • ');
  const logo = school.logo_url || campus.logo || '/logo.png';
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${certificateNo}`;
  const recipientName = recipient.name || 'Recipient Full Name';

  const honorCredit = recipient.current_grade?.name
    ? `${recipient.current_grade?.name} — Section ${recipient.current_section || 'A'}`
    : (recipient.designation || 'Academic & Performance Honors');

  const courseTitle = customText || 'Institutional Completion & Proficiency Curriculum';

  return (
    <div
      className="w-full h-full text-slate-900 relative p-5 select-none flex flex-col justify-between box-border overflow-hidden"
      style={{
        backgroundColor: '#618597',
        backgroundImage: 'repeating-linear-gradient(90deg, #618597, #618597 2px, #698e9f 2px, #698e9f 4px)'
      }}
    >
      <div className="absolute inset-2 border-2 border-white pointer-events-none" />
      <div className="absolute inset-3.5 border-2 border-white/85 pointer-events-none" />

      <div className="relative z-10 w-full h-full bg-white text-slate-800 p-4 flex flex-col justify-between border border-slate-200 shadow-md box-border overflow-hidden">
        <div className="text-center space-y-0.5">
          <div className="flex items-center justify-center gap-2.5 pb-0.5">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full border border-slate-300 p-0.5 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 font-sans leading-tight">
                {schoolName}
              </h2>
              <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>

          <h1
            className="text-2xl font-serif italic text-slate-900 tracking-wide text-center"
            style={{ fontFamily: "'Pinyon Script', 'Rochester', Georgia, serif" }}
          >
            {customHeading || template.heading || `${schoolName} Certificate of Completion`}
          </h1>
          <p className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-widest">
            {subHeading || template.sub_heading || 'Official Institutional Credential'}
          </p>
        </div>

        <div className="text-center space-y-1 py-0.5">
          <div className="w-full max-w-sm mx-auto border-b border-slate-600 pb-0.5">
            <span className="text-xl font-bold font-sans text-slate-950 tracking-wide">
              {recipientName}
            </span>
          </div>

          <div className="space-y-0.5">
            <span
              className="text-sm font-serif italic text-slate-600 block"
              style={{ fontFamily: "'Pinyon Script', 'Rochester', Georgia, serif" }}
            >
              has earned
            </span>
            <span className="text-xs font-bold font-sans text-[#4a6b7c] block tracking-wide">
              {honorCredit}
            </span>
          </div>

          <div className="space-y-0.5">
            <span
              className="text-xs font-serif italic text-slate-500 block"
              style={{ fontFamily: "'Pinyon Script', 'Rochester', Georgia, serif" }}
            >
              while completing the training course entitled
            </span>
            <div className="w-full max-w-sm mx-auto border-b border-slate-400 pb-0.5">
              <span className="text-xs font-bold font-sans text-slate-900 tracking-wide">
                {courseTitle}
              </span>
            </div>
          </div>

          <p className="text-[9.5px] text-slate-600 leading-relaxed max-w-md mx-auto line-clamp-2 mt-0.5 font-normal">
            {customBody || resolvedBody || template.body_template || 'Recognized for honorable diligence, academic excellence, and distinguished institutional accomplishment.'}
          </p>
        </div>

        <CertificateFooterBlock
          signatoryTitle1={signatoryTitle1}
          signatoryTitle2={signatoryTitle2}
          principalSignatureUrl={school.principal_signature_url}
          showStamp={showStamp}
          showQr={showQr}
          issueDate={issueDate}
          certificateNo={certificateNo}
          verifyUrl={verifyUrl}
          accentColor="#618597"
          borderClass="border-slate-300"
        />
      </div>
    </div>
  );
};

export default Design5SlateMultiBorder;
