import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const Design1AcademicGoldHatch = ({
  certificateNo = 'CERT-2026-0001',
  template = {},
  school = {},
  campus = {},
  recipient = {},
  recipientType = 'Student',
  customText = '',
  customHeading = '',
  customBody = '',
  resolvedBody = '',
  issueDate = new Date().toISOString().split('T')[0],
  orientation = 'landscape'
}) => {
  const isPortrait = orientation === 'portrait';
  const schoolName = (school.name || campus.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const campusSub = campus.name ? `${campus.name} ${school.slogan ? `• ${school.slogan}` : ''}` : (school.slogan || 'Excellence in Education');
  const logo = school.logo_url || campus.logo || '/logo.png';
  const recipientName = recipient.name || 'Recipient Full Name';

  return (
    <div className="w-full h-full bg-white text-slate-900 relative p-3 sm:p-5 select-none flex flex-col justify-between border-[5px] border-[#b59449]">
      <div className="absolute inset-2 sm:inset-3 border-[10px] sm:border-[14px] border-transparent pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #e5e7eb, #e5e7eb 2px, transparent 2px, transparent 8px)' }} />
      <div className="relative z-10 w-full h-full border border-[#b59449] p-3 sm:p-5 flex flex-col justify-between bg-white/95">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-full border-2 border-[#b59449]/40 p-1 bg-white shadow-2xs shrink-0" />
            <div className="text-left">
              <h2 className="text-sm sm:text-base md:text-xl font-black tracking-wider uppercase text-slate-900 leading-tight">{schoolName}</h2>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold">{campusSub}</p>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-wide text-[#b59449] drop-shadow-xs" style={{ fontFamily: 'Georgia, serif' }}>
            Certificate
          </h1>
          <div className="inline-block bg-gradient-to-r from-[#d4af37] via-[#b59449] to-[#d4af37] text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-6 py-0.5 rounded-sm tracking-widest shadow-2xs">
            {template.sub_heading || 'THIS CERTIFICATE IS PRESENTED TO'}
          </div>
          <div className="flex justify-center -mt-0.5">
            <svg viewBox="0 0 100 12" className="w-20 h-2 text-[#b59449]" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M 10,6 C 25,12 35,0 50,6 C 65,12 75,0 90,6 M 40,6 C 45,9 55,9 60,6" />
            </svg>
          </div>
        </div>

        <div className={`text-center space-y-2 ${isPortrait ? 'py-2 my-auto' : 'py-1'}`}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-slate-800 tracking-wide underline decoration-[#b59449]/40 underline-offset-4">
            {recipientName}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium italic">in recognition of honorable merit, exemplary conduct, and institutional standing</p>
          <div className="max-w-xl mx-auto px-4">
            <h4 className="text-sm sm:text-base font-bold text-[#7c4d25] uppercase tracking-wide">
              {customHeading || template.heading || 'SCHOOL LEAVING CERTIFICATE'}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-700 font-medium leading-relaxed mt-1 line-clamp-3">
              {customBody || resolvedBody || template.body_template || `Recognized for meritorious dedication and exemplary scholastic achievement in ${customText}.`}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#b59449]/30">
          <div className="grid grid-cols-3 items-end gap-2 px-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-full max-w-[120px] border-b border-dashed border-slate-400 pb-0.5 text-[11px] font-bold text-slate-800">{issueDate}</div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">ISSUE DATE</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <OfficialSignatureStampBlock showSignature={false} showStamp={true} stampTitle="Official Stamp" compact={true} hideControls={true} />
            </div>
            <div className="flex flex-col items-center text-center">
              <OfficialSignatureStampBlock showSignature={true} showStamp={false} signatureTitle="Institutional Head" compact={true} hideControls={true} />
            </div>
          </div>
          <div className="flex items-center justify-between text-[8px] text-slate-500 px-1 border-t border-slate-200 pt-1 font-mono">
            <span>Validation: <strong className="text-slate-700">{certificateNo}</strong></span>
            <span className="font-sans font-bold text-slate-400">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design1AcademicGoldHatch;
