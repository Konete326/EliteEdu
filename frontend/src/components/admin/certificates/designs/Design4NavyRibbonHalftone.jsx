import React from 'react';
import { ChampionBadge } from './CertificateGoldSeal';
import CertificateFooterBlock from '../CertificateFooterBlock';

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
    <div className="w-full h-full bg-[#f8fafc] text-slate-900 relative p-3 sm:p-5 select-none flex flex-col justify-between border-[3px] border-[#051937] shadow-sm overflow-hidden box-border">
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-25 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '8px 8px' }}
      />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#051937] rotate-45 border-t-4 border-[#d97706] pointer-events-none" />

      <div className="absolute top-0 left-4 sm:left-6 w-10 sm:w-14 bottom-0 bg-[#051937] flex flex-col items-center justify-between py-4 z-20">
        <div className="w-full h-8 bg-[#051937]" />
        <div className="relative -mx-8 sm:-mx-10 my-auto">
          <ChampionBadge size={isPortrait ? 68 : 80} />
        </div>
        <div className="w-full h-8 bg-[#051937]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 65%, 0 100%)' }} />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between pl-14 sm:pl-20 pr-4 sm:pr-6 py-1 box-border">
        <div className="relative w-full text-center space-y-1">
          <div className="flex items-center justify-center gap-3 border-b border-slate-200 pb-1">
            <img
              src={logo}
              alt="School Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border-2 border-[#051937] p-1 bg-white shadow-2xs shrink-0"
            />
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-[#051937] leading-tight">
                {schoolName}
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wide">
                {campusSub}
              </p>
            </div>
          </div>

          <div
            className="mx-auto max-w-lg bg-[#051937] text-white py-1 px-6 shadow-md relative"
            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
          >
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase font-sans">
              {customHeading || template.heading || 'Teacher of the Year'}
            </h1>
          </div>
          <p className="text-[9.5px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            {subHeading || template.sub_heading || 'This certificate acknowledges that'}
          </p>
        </div>

        <div className={`text-center space-y-1 ${isPortrait ? 'py-4 my-auto' : 'py-1'}`}>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#b45309] tracking-wide" style={{ fontFamily: 'Georgia, cursive' }}>
            {recipientName}
          </h2>
          <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">has been awarded the prestigious title of</p>
          <h3 className="text-sm sm:text-base font-black text-[#051937] tracking-wide uppercase">
            The Top-Performing Champion
          </h3>
          <div className="max-w-xl mx-auto px-2">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-600 font-medium leading-relaxed">
              {customBody || resolvedBody || template.body_template || `In recognition of their outstanding dedication, passion, and scholastic excellence in ${customText}.`}
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
          accentColor="#051937"
          borderClass="border-slate-200"
        />
      </div>
    </div>
  );
};

export default Design4NavyRibbonHalftone;