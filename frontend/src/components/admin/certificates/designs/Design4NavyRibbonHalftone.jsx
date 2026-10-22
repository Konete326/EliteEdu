import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { ChampionBadge } from './CertificateGoldSeal';
import { renderSvgQrCode } from '../../../../utils/idCardCodeGenerator';

const Design4NavyRibbonHalftone = ({
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
  const recipientName = recipient.name || "Recipient's Name";

  return (
    <div className="w-full h-full bg-[#f8fafc] text-slate-900 relative p-3 sm:p-5 select-none flex flex-col justify-between border-[3px] border-[#051937] shadow-sm overflow-hidden">
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-25 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '8px 8px' }}
      />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#051937] rotate-45 border-t-4 border-[#d97706] pointer-events-none" />

      <div className="absolute top-0 left-4 sm:left-6 w-10 sm:w-14 bottom-0 bg-[#051937] flex flex-col items-center justify-between py-4 z-20">
        <div className="w-full h-8 bg-[#051937]" />
        <div className="relative -mx-8 sm:-mx-10 my-auto">
          <ChampionBadge size={isPortrait ? 68 : 82} />
        </div>
        <div className="w-full h-8 bg-[#051937]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 65%, 0 100%)' }} />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between pl-14 sm:pl-22 pr-4 sm:pr-8 py-1">
        <div className="relative w-full text-center space-y-1.5">
          <div className="flex items-center justify-center gap-3 border-b border-slate-200 pb-1.5">
            <img
              src={logo}
              alt="School Logo"
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded-full border-2 border-[#051937] p-1 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase text-[#051937] leading-tight">
                {schoolName}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>

          <div
            className="mx-auto max-w-lg bg-[#051937] text-white py-1 px-6 shadow-md relative"
            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
          >
            <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-wider uppercase font-sans">
              {customHeading || template.heading || 'Teacher of the Year'}
            </h1>
          </div>
          <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            {subHeading || template.sub_heading || 'This certificate acknowledges that'}
          </p>
        </div>

        <div className={`text-center space-y-1.5 ${isPortrait ? 'py-4 my-auto' : 'py-1'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[#b45309] tracking-wide" style={{ fontFamily: 'Georgia, cursive' }}>
            {recipientName}
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">has been awarded the prestigious title of</p>
          <h3 className="text-base sm:text-xl font-black text-[#051937] tracking-wide uppercase">
            The Top-Performing Champion
          </h3>
          <div className="max-w-xl mx-auto px-2">
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium leading-relaxed">
              {customBody || resolvedBody || template.body_template || `In recognition of their outstanding dedication, passion, and scholastic excellence in ${customText}.`}
            </p>
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono text-slate-500">
            <span>Date: <strong>{issueDate}</strong></span> | <span>No: <strong>{certificateNo}</strong></span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="grid grid-cols-3 items-end gap-2">
            <div className="flex flex-col items-center text-center">
              {showQr ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-white p-0.5 border border-slate-300 rounded shadow-2xs">
                    {renderSvgQrCode(verifyUrl, 20)}
                  </div>
                  <div className="text-left font-mono text-[8px] text-slate-500 leading-tight">
                    <span className="font-bold text-slate-800 block">AUTHENTIC</span>
                    <span>RECORD</span>
                  </div>
                </div>
              ) : (
                <div className="text-[9px] font-mono text-slate-600 font-bold">
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
                compact={true}
                hideControls={true}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-100 font-mono mt-1">
            <span>Official Certificate</span>
            <span className="font-sans font-bold">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design4NavyRibbonHalftone;