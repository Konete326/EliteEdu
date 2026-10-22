import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { renderSvgQrCode } from '../../../../utils/idCardCodeGenerator';

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
    <div className="w-full h-full bg-[#fdfaf6] text-slate-900 relative p-4 sm:p-7 select-none flex flex-col justify-between border-[6px] border-[#6b2d26] shadow-sm">
      <div
        className="absolute inset-1.5 sm:inset-2.5 border-[3px] border-[#8c3b32]/40 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#8c3b32 0.75px, transparent 0.75px)', backgroundSize: '10px 10px' }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between text-center px-4 sm:px-10 py-1 bg-[#fdfaf6]/95">
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-center gap-3 border-b border-[#8c3b32]/20 pb-2">
            <img
              src={logo}
              alt="School Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full border-2 border-[#8c3b32]/40 p-1 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase text-slate-900 leading-tight">
                {schoolName}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-slate-900 font-sans">
            {customHeading || template.heading || 'TEACHER OF THE YEAR CERTIFICATE'}
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-slate-600">
            {subHeading || template.sub_heading || 'This certificate is proudly presented to'}
          </p>
        </div>

        <div className={`space-y-3 ${isPortrait ? 'py-4 my-auto' : 'py-2'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-wider font-sans underline decoration-[#8c3b32]/40 underline-offset-8">
            {recipientName}
          </h2>
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
              {customBody || resolvedBody || template.body_template || `Awarded for exceptional leadership in educational reform, pedagogy, and outstanding contributions in ${customText}.`}
            </p>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-600 space-y-0.5">
            <div>Date of issue: <strong className="text-slate-900">{issueDate}</strong></div>
            <div>Certificate No: <strong className="text-slate-900">{certificateNo}</strong></div>
          </div>
        </div>

        <div className="pt-2 relative">
          <div className="grid grid-cols-3 items-end gap-2 px-2 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <OfficialSignatureStampBlock
                showSignature={true}
                showStamp={false}
                signatureTitle={signatoryTitle1}
                compact={true}
                hideControls={true}
              />
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

          <div className="flex items-center justify-between text-[8px] text-slate-400 pt-2 border-t border-[#8c3b32]/20 font-mono mt-1">
            <div className="flex items-center gap-1.5">
              {showQr && (
                <>
                  <div className="w-5 h-5 bg-white p-0.5 border border-slate-300 rounded shrink-0">
                    {renderSvgQrCode(verifyUrl, 18)}
                  </div>
                  <span>Scan to Authenticate</span>
                </>
              )}
            </div>
            <span className="font-sans font-bold">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design3GuillocheRosette;