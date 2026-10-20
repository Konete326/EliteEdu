import { useState, useEffect } from 'react';
import api from '../../../../services/api';

const AdmissionFooterRules = () => {
  const [signature, setSignature] = useState(null);
  const [stamp, setStamp] = useState(null);

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

  return (
    <div className="pt-2 space-y-2.5">
      <div>
        <h4 className="text-[10px] font-black uppercase text-ink dark:text-ink-dark tracking-wider mb-0.5">
          Declaration & Institutional Rules
        </h4>
        <ul className="text-[9px] text-ink-sub dark:text-ink-sub-dark space-y-0.5 list-disc pl-3.5 leading-snug">
          <li>Tuition fee must be cleared on or before the 10th of each calendar month.</li>
          <li>A minimum of 80% attendance and official code of conduct are mandatory.</li>
          <li>I solemnly declare that all particulars submitted above are authentic and accurate.</li>
        </ul>
      </div>

      <div className="pt-2 grid grid-cols-2 gap-8 text-xs font-semibold text-ink dark:text-ink-dark">
        <div className="border-t border-ink/40 dark:border-white/20 pt-1.5 text-center min-h-[48px] flex flex-col justify-end">
          {signature ? (
            <img src={signature.image_url} alt={signature.label} className="h-8 mx-auto object-contain mb-0.5" />
          ) : (
            <div className="h-6" />
          )}
          <p className="uppercase text-[10px] font-bold">Signature of Authority</p>
          <span className="text-[8.5px] text-ink-muted">{signature?.label || 'Principal / Headmaster'}</span>
        </div>
        <div className="border-t border-ink/40 dark:border-white/20 pt-1.5 text-center min-h-[48px] flex flex-col justify-end">
          {stamp ? (
            <img src={stamp.image_url} alt={stamp.label} className="h-9 mx-auto object-contain mb-0.5 rotate-[-3deg]" />
          ) : (
            <div className="h-6" />
          )}
          <p className="uppercase text-[10px] font-bold">Institute Stamp</p>
          <span className="text-[8.5px] text-ink-muted">{stamp?.label || 'Official Verification Seal'}</span>
        </div>
      </div>
    </div>
  );
};

export default AdmissionFooterRules;
