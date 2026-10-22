import React from 'react';
import CertificateFooterBlock from '../CertificateFooterBlock';

const Design3GuillocheRosette = ({
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
  signatoryTitle1 = 'Teacher In-Charge',
  signatoryTitle2 = 'Principal / Headmaster',
  showStamp = true,
  showQr = true
}) => {
  const isPortrait = orientation === 'portrait';
  const schoolName = (school.name || campus.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const sloganText = customSlogan !== undefined && customSlogan !== ''
    ? customSlogan
    : (campus.motto || school.slogan || 'Academic Excellence & Leadership');
  const campusSub = [campus.name, sloganText].filter(Boolean).join(' • ');
  const logo = school.logo_url || campus.logo || '/logo.png';
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${certificateNo}`;
  const recipientName = (recipient.name || 'Recipient Name').toUpperCase();

  return (
    <div className="w-full h-full bg-[#fdfaf6] text-slate-900 relative p-4 select-none flex flex-col justify-between border-[5px] border-[#6b2d26] shadow-sm box-border overflow-hidden">
      <div
        className="absolute inset-1.5 border-[3px] border-[#8c3b32]/40 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#8c3b32 0.75px, transparent 0.75px)', backgroundSize: '10px 10px' }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between text-center px-6 py-1 bg-[#fdfaf6]/95 box-border overflow-hidden">
        <div className="space-y-0.5 pt-0.5">
          <div className="flex items-center justify-center gap-2.5 border-b border-[#8c3b32]/20 pb-1">
            <img
              src={logo}
              alt="School Logo"
              className="w-11 h-11 object-contain rounded-full border-2 border-[#8c3b32]/40 p-0.5 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900 leading-tight">
                {schoolName}
              </h2>
              <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-widest uppercase text-slate-900 font-sans">
            {customHeading || template.heading || 'TEACHER OF THE YEAR CERTIFICATE'}
          </h1>
          <p className="text-[9px] font-semibold tracking-wide text-slate-600">
            {subHeading || template.sub_heading || 'This certificate is proudly presented to'}
          </p>
        </div>

        <div className={`space-y-1 ${isPortrait ? 'py-3 my-auto' : 'py-0.5'}`}>
          <h2 className="text-2xl font-black text-slate-950 tracking-wider font-sans underline decoration-[#8c3b32]/40 underline-offset-4">
            {recipientName}
          </h2>
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-[10px] text-slate-700 leading-relaxed font-normal line-clamp-2">
              {customBody || resolvedBody || template.body_template || `Awarded for exceptional leadership in educational reform, pedagogy, and outstanding contributions in ${customText}.`}
            </p>
          </div>
        </div>

        <CertificateFooterBlock
          signatoryTitle1={signatoryTitle1}
          signatoryTitle2={signatoryTitle2}
          teacherSignatureUrl={school.teacher_signature_url}
          principalSignatureUrl={school.principal_signature_url}
          showStamp={showStamp}
          showQr={showQr}
          issueDate={issueDate}
          certificateNo={certificateNo}
          verifyUrl={verifyUrl}
          accentColor="#6b2d26"
          borderClass="border-[#8c3b32]/30"
        />
      </div>
    </div>
  );
};

export default Design3GuillocheRosette;