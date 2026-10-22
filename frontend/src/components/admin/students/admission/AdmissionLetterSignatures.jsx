import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { renderSvgQrCode, generateStudentVerifyUrl } from '../../../../utils/idCardCodeGenerator';

const AdmissionLetterSignatures = ({ student, template }) => {
  const [signature, setSignature] = useState(null);
  const [stamp, setStamp] = useState(null);

  const school = student?.school_id || {};
  const campus = student?.campus_id || {};
  const schoolName = school.name || campus.name || '';
  const verifyUrl = student ? generateStudentVerifyUrl(student) : 'https://elitedev-edu.vercel.app';

  useEffect(() => {
    let mounted = true;
    api.get('/signatures')
      .then((res) => {
        if (!mounted) return;
        const items = res.data?.data || [];
        const defSig = items.find((s) => !s.is_stamp && s.is_default) || items.find((s) => !s.is_stamp);
        const defStp = items.find((s) => s.is_stamp && s.is_default) || items.find((s) => s.is_stamp);
        if (defSig) setSignature(defSig);
        if (defStp) setStamp(defStp);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const sigImgUrl = signature?.image_url || school.principal_signature_url;
  const signatoryName = template?.signatory_name || signature?.label || school.principal_name || '';
  const signatoryTitle = template?.signatory_title || 'For: Admissions & Academic Directorate';

  return (
    <div className="pt-4 space-y-3 font-serif">
      <p className="text-xs font-bold text-black">Yours faithfully,</p>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2">
        <div className="sm:col-span-5 text-left space-y-1">
          <div className="min-h-[46px] flex items-end">
            {sigImgUrl ? (
              <img
                src={sigImgUrl}
                alt={signatoryName || 'Signature'}
                className="h-11 object-contain"
              />
            ) : (
              <div className="w-36 border-b border-black/80 pb-1" />
            )}
          </div>
          <div>
            {Boolean(signatoryName) && (
              <p className="font-bold text-xs uppercase tracking-wide text-black">
                {signatoryName}
              </p>
            )}
            <p className="text-[10px] text-black/80 italic font-medium">
              {signatoryTitle}
            </p>
            {Boolean(schoolName) && (
              <p className="text-[10px] text-black/70 font-semibold uppercase">
                {schoolName}
              </p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3 flex justify-center">
          {stamp?.image_url ? (
            <img
              src={stamp.image_url}
              alt="Official Seal"
              className="w-18 h-18 object-contain -rotate-6 opacity-95 print:opacity-100"
            />
          ) : null}
        </div>

        <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center">
          <div
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            className="p-2 border border-black/30 rounded-lg bg-white shadow-2xs text-center flex flex-col items-center print:border-black"
          >
            <div className="w-20 h-20 bg-white flex items-center justify-center overflow-hidden">
              {renderSvgQrCode(verifyUrl, 76)}
            </div>
            <p className="text-[8px] font-mono font-black uppercase tracking-tight text-black mt-1">
              Scan To Verify Authenticity
            </p>
            <p className="text-[7.5px] font-mono text-black/60 truncate max-w-[110px]">
              ID: {student?.gr_number || 'VERIFIED'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionLetterSignatures;
