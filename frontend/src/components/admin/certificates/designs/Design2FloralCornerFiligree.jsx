import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { CornerFiligrees } from './CertificateCornerFiligree';
import { renderSvgQrCode } from '../../../../utils/idCardCodeGenerator';

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
    <div className="w-full h-full bg-white text-slate-900 relative p-4 sm:p-6 select-none flex flex-col justify-between border-[4px] border-[#f59e0b] shadow-xs">
      <div className="absolute inset-1.5 sm:inset-2.5 border border-[#1e293b]/20 pointer-events-none" />
      <CornerFiligrees size={isPortrait ? 80 : 96} />

      <div className="relative z-10 w-full h-full flex flex-col justify-between text-center px-4 sm:px-12 py-1">
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-center gap-3 border-b border-[#f59e0b]/30 pb-2">
            <img
              src={logo}
              alt="School Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full border-2 border-[#f59e0b]/40 p-1 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase text-slate-950 font-sans leading-tight">
                {schoolName}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider uppercase text-[#f5a623] pt-1">
            {customHeading || template.heading || 'CERTIFICATE OF EXPERIENCE'}
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-600 tracking-wide">
            {subHeading || template.sub_heading || 'This certificate is presented to'}
          </p>
        </div>

        <div className={`space-y-2.5 ${isPortrait ? 'py-4 my-auto' : 'py-2'}`}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#f5a623] tracking-wide font-sans">
            {recipientName}
          </h3>
          <div className="max-w-xl mx-auto px-2">
            <p className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 leading-relaxed">
              {customBody || resolvedBody || template.body_template || `For exemplary teaching experience and dedicated service during school year ${customText}.`}
            </p>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-600 space-y-0.5">
            <div>Given this <strong className="text-slate-900">{issueDate}</strong></div>
            <div>Certificate ID: <strong className="text-slate-900">{certificateNo}</strong></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/80">
          <div className="grid grid-cols-3 items-end gap-2 px-2 sm:px-6">
            <div className="flex flex-col items-center text-center">
              {showQr ? (
                <div className="flex items-center gap-1.5 text-left">
                  <div className="w-7 h-7 bg-white p-0.5 border border-slate-300 rounded shadow-2xs">
                    {renderSvgQrCode(verifyUrl, 24)}
                  </div>
                  <div className="text-[8px] font-mono text-slate-500 leading-tight">
                    <span className="font-bold text-slate-700 block">AUTHENTIC</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-slate-600 font-bold">
                  {signatoryTitle1}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              {showStamp && (
                <OfficialSignatureStampBlock
                  showSignature={false}
                  showStamp={true}
                  stampTitle="Official Seal"
                  compact={true}
                  hideControls={true}
                />
              )}
            </div>

            <div className="flex flex-col items-center text-center">
              <OfficialSignatureStampBlock
                showSignature={true}
                showStamp={false}
                signatureTitle={signatoryTitle2}
                principalSignatureUrl={school.principal_signature_url}
                compact={true}
                hideControls={true}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-400 pt-2 border-t border-slate-100 font-mono mt-1">
            <span>Certificate System</span>
            <span className="font-sans font-bold">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design2FloralCornerFiligree;