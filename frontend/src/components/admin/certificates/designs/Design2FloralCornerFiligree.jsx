import React from 'react';
import { CornerFiligrees } from './CertificateCornerFiligree';
import CertificateFooterBlock from '../CertificateFooterBlock';

const Design2FloralCornerFiligree = ({
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
  signatoryTitle2 = 'School Administrator',
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
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${certificateNo}`;
  const recipientName = recipient.name || 'Recipient Name';

  return (
    <div className="w-full h-full bg-white text-slate-900 relative p-4 select-none flex flex-col justify-between border-[4px] border-[#f59e0b] shadow-xs box-border overflow-hidden">
      <div className="absolute inset-1.5 border border-[#1e293b]/20 pointer-events-none" />
      <CornerFiligrees size={isPortrait ? 76 : 84} />

      <div className="relative z-10 w-full h-full flex flex-col justify-between text-center px-8 py-1 box-border overflow-hidden">
        <div className="space-y-0.5 pt-0.5">
          <div className="flex items-center justify-center gap-2.5 border-b border-[#f59e0b]/30 pb-1">
            <img
              src={logo}
              alt="School Logo"
              className="w-11 h-11 object-contain rounded-full border-2 border-[#f59e0b]/40 p-0.5 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-950 font-sans leading-tight">
                {schoolName}
              </h2>
              <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-wider uppercase text-[#f5a623] pt-0.5">
            {customHeading || template.heading || 'CERTIFICATE OF EXPERIENCE'}
          </h1>
          <p className="text-[9px] font-semibold text-slate-600 tracking-wide">
            {subHeading || template.sub_heading || 'This certificate is presented to'}
          </p>
        </div>

        <div className={`space-y-1 ${isPortrait ? 'py-3 my-auto' : 'py-0.5'}`}>
          <h3 className="text-2xl font-black text-[#f5a623] tracking-wide font-sans">
            {recipientName}
          </h3>
          <div className="max-w-xl mx-auto px-2">
            <p className="text-[10px] font-medium text-slate-700 leading-relaxed line-clamp-2">
              {customBody || resolvedBody || template.body_template || `For exemplary teaching experience and dedicated service during school year ${customText}.`}
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
          accentColor="#f59e0b"
          borderClass="border-slate-200"
        />
      </div>
    </div>
  );
};

export default Design2FloralCornerFiligree;