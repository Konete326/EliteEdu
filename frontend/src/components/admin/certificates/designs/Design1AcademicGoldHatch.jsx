import React from 'react';
import CertificateFooterBlock from '../CertificateFooterBlock';

const Design1AcademicGoldHatch = ({
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
    : (campus.motto || school.slogan || 'Excellence in Education');
  const campusSub = [campus.name, sloganText].filter(Boolean).join(' • ');
  const logo = school.logo_url || campus.logo || '/logo.png';
  const recipientName = recipient.name || 'Recipient Full Name';
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${certificateNo}`;

  return (
    <div className="w-full h-full bg-white text-slate-900 relative p-4 sm:p-5 select-none flex flex-col justify-between border-[5px] border-[#b59449] box-border overflow-hidden">
      <div
        className="absolute inset-2 sm:inset-3 border-[10px] sm:border-[14px] border-transparent pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #e5e7eb, #e5e7eb 2px, transparent 2px, transparent 8px)' }}
      />
      <div className="relative z-10 w-full h-full border border-[#b59449] p-3 sm:p-4 flex flex-col justify-between bg-white/95 box-border">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full border-2 border-[#b59449]/40 p-1 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase text-slate-900 leading-tight">
                {schoolName}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-600 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide text-[#b59449] drop-shadow-xs"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Certificate
          </h1>
          <div className="inline-block bg-gradient-to-r from-[#d4af37] via-[#b59449] to-[#d4af37] text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-6 py-0.5 rounded-sm tracking-widest shadow-2xs">
            {subHeading || template.sub_heading || 'THIS CERTIFICATE IS PRESENTED TO'}
          </div>
          <div className="flex justify-center -mt-0.5">
            <svg viewBox="0 0 100 12" className="w-16 h-2 text-[#b59449]" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M 10,6 C 25,12 35,0 50,6 C 65,12 75,0 90,6 M 40,6 C 45,9 55,9 60,6" />
            </svg>
          </div>
        </div>

        <div className={`text-center space-y-1.5 ${isPortrait ? 'py-3 my-auto' : 'py-1'}`}>
          <h3 className="text-2xl sm:text-3xl font-serif italic text-slate-800 tracking-wide underline decoration-[#b59449]/40 underline-offset-4">
            {recipientName}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium italic">
            in recognition of honorable merit, exemplary conduct, and institutional standing
          </p>
          <div className="max-w-xl mx-auto px-4">
            <h4 className="text-xs sm:text-sm font-bold text-[#7c4d25] uppercase tracking-wide">
              {customHeading || template.heading || 'SCHOOL LEAVING CERTIFICATE'}
            </h4>
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-700 font-medium leading-relaxed mt-0.5 line-clamp-3">
              {customBody || resolvedBody || template.body_template || `Recognized for meritorious dedication and exemplary scholastic achievement in ${customText}.`}
            </p>
          </div>
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
          accentColor="#b59449"
          borderClass="border-[#b59449]/30"
        />
      </div>
    </div>
  );
};

export default Design1AcademicGoldHatch;