import React from 'react';
import { SunburstSeal } from './designs/CertificateGoldSeal';
import { renderSvgQrCode } from '../../../utils/idCardCodeGenerator';

const CertificateFooterBlock = ({
  signatoryTitle1 = 'Teacher In-Charge',
  signatoryTitle2 = 'Principal / Headmaster',
  teacherSignatureUrl = '',
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
    <div className={`space-y-0.5 pt-1 border-t ${borderClass} w-full max-w-[86%] mx-auto shrink-0 select-none`}>
      <div className="grid grid-cols-3 items-end gap-2 px-1 text-center">
        <div className="flex flex-col items-center justify-end text-center">
          {teacherSignatureUrl ? (
            <img
              src={teacherSignatureUrl}
              alt={signatoryTitle1}
              className="h-5 max-w-[95px] object-contain mb-0.5 drop-shadow-2xs"
            />
          ) : (
            <div className="h-5" />
          )}
          <div className="w-24 sm:w-28 border-b border-slate-700 mb-0.5" />
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-800 leading-tight">
            {signatoryTitle1}
          </p>
          <span className="text-[7.5px] text-slate-500 font-medium tracking-wide">
            Authorized Signatory
          </span>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          {showStamp ? (
            <div className="flex flex-col items-center justify-center">
              <SunburstSeal size={38} />
              <span className="text-[7px] font-extrabold uppercase tracking-widest text-[#a16207] mt-0.5">
                Official Seal
              </span>
            </div>
          ) : (
            <div className="h-9" />
          )}
        </div>

        <div className="flex flex-col items-center justify-end text-center">
          {principalSignatureUrl ? (
            <img
              src={principalSignatureUrl}
              alt={signatoryTitle2}
              className="h-5 max-w-[95px] object-contain mb-0.5 drop-shadow-2xs"
            />
          ) : (
            <div className="h-5" />
          )}
          <div className="w-24 sm:w-28 border-b border-slate-700 mb-0.5" />
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-800 leading-tight">
            {signatoryTitle2}
          </p>
          <span className="text-[7.5px] text-slate-500 font-medium tracking-wide">
            Head of Institution
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[7px] text-slate-500 px-1 border-t border-slate-200/80 pt-0.5 font-mono">
        <div className="flex items-center gap-1.5 text-left">
          {showQr && (
            <div className="w-4 h-4 bg-white p-0.5 border border-slate-300 rounded shadow-2xs shrink-0 flex items-center justify-center">
              {renderSvgQrCode(verifyUrl, 14)}
            </div>
          )}
          <div className="leading-tight">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[6.5px]">
              Verifiable Credential
            </span>
            <span className="text-[6.5px]">
              Serial: <strong className="text-slate-900 font-semibold">{certificateNo}</strong>
            </span>
          </div>
        </div>

        <div className="text-center font-medium text-[7px]">
          Date of Issuance: <strong className="text-slate-800 font-bold">{issueDate}</strong>
        </div>

        <div className="text-right text-[7px]">
          <span className="font-sans font-bold text-slate-600">EliteEdu</span> Verified System
        </div>
      </div>
    </div>
  );
};

export default CertificateFooterBlock;
