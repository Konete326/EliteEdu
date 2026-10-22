import React from 'react';
import { SunburstSeal } from './designs/CertificateGoldSeal';
import { renderSvgQrCode } from '../../../utils/idCardCodeGenerator';

const CertificateFooterBlock = ({
  signatoryTitle1 = 'Teacher In-Charge',
  signatoryTitle2 = 'Principal / Headmaster',
  principalSignatureUrl = '',
  showStamp = true,
  showQr = true,
  issueDate = '',
  certificateNo = '',
  verifyUrl = '',
  accentColor = '#b59449',
  borderClass = 'border-[#b59449]/30'
}) => {
  return (
    <div className={`space-y-2 pt-2 border-t ${borderClass} w-full`}>
      <div className="grid grid-cols-3 items-end gap-2 px-2 text-center">
        <div className="flex flex-col items-center justify-end text-center">
          <div className="w-32 sm:w-40 border-b-2 border-slate-700 dark:border-slate-800 mb-1 h-8 flex items-end justify-center pb-0.5" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-800 leading-tight">
            {signatoryTitle1}
          </p>
          <span className="text-[9px] text-slate-500 font-medium tracking-wide">
            Authorized Signatory
          </span>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          {showStamp ? (
            <div className="flex flex-col items-center justify-center">
              <SunburstSeal size={58} />
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#a16207] mt-0.5">
                Official Seal
              </span>
            </div>
          ) : (
            <div className="h-12" />
          )}
        </div>

        <div className="flex flex-col items-center justify-end text-center">
          {principalSignatureUrl ? (
            <img
              src={principalSignatureUrl}
              alt={signatoryTitle2}
              className="h-8 max-w-[130px] object-contain mb-0.5 drop-shadow-2xs"
            />
          ) : (
            <div className="h-8" />
          )}
          <div className="w-32 sm:w-40 border-b-2 border-slate-700 dark:border-slate-800 mb-1" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-800 leading-tight">
            {signatoryTitle2}
          </p>
          <span className="text-[9px] text-slate-500 font-medium tracking-wide">
            Head of Institution
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] text-slate-500 px-1 border-t border-slate-200/80 pt-1 font-mono">
        <div className="flex items-center gap-1.5 text-left">
          {showQr && (
            <div className="w-6 h-6 bg-white p-0.5 border border-slate-300 rounded shadow-2xs shrink-0">
              {renderSvgQrCode(verifyUrl, 20)}
            </div>
          )}
          <div className="leading-tight">
            <span className="font-bold text-slate-800 block uppercase tracking-wider">
              Verifiable Credential
            </span>
            <span>
              Serial: <strong className="text-slate-900">{certificateNo}</strong>
            </span>
          </div>
        </div>

        <div className="text-center font-medium">
          Date of Issuance: <strong className="text-slate-800 font-bold">{issueDate}</strong>
        </div>

        <div className="text-right">
          <span className="font-sans font-bold text-slate-600">EliteEdu</span> Verified System
        </div>
      </div>
    </div>
  );
};

export default CertificateFooterBlock;
