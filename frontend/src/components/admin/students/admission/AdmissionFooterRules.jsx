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
    <div className="pt-3 space-y-4">
      <div>
        <h4 className="text-[11px] font-black uppercase text-ink dark:text-ink-dark tracking-wider mb-1">
          Rules And Regulations:
        </h4>
        <ul className="text-[10px] text-ink-sub dark:text-ink-sub-dark space-y-0.5 list-disc pl-4 leading-relaxed">
          <li>Institutional tuition and examination fees must be cleared on or before the 10th of each calendar month.</li>
          <li>A minimum of 80% attendance is strictly required for appearing in annual and board examinations.</li>
          <li>Official uniform, punctuality, and student code of conduct must be observed during all school hours.</li>
          <li>Prior written notification or medical certificate is required for student absences.</li>
        </ul>
      </div>

      <div className="pt-4 grid grid-cols-2 gap-8 text-xs font-semibold text-ink dark:text-ink-dark">
        <div className="border-t border-ink/40 dark:border-white/20 pt-2 text-center min-h-[56px] flex flex-col justify-end">
          {signature ? (
            <img src={signature.image_url} alt={signature.label} className="h-9 mx-auto object-contain mb-1" />
          ) : (
            <div className="h-7" />
          )}
          <p className="uppercase text-[11px] font-bold">Signature of Authority</p>
          <span className="text-[9px] text-ink-muted">{signature?.label || 'Principal / Headmaster'}</span>
        </div>
        <div className="border-t border-ink/40 dark:border-white/20 pt-2 text-center min-h-[56px] flex flex-col justify-end">
          {stamp ? (
            <img src={stamp.image_url} alt={stamp.label} className="h-10 mx-auto object-contain mb-1 rotate-[-3deg]" />
          ) : (
            <div className="h-7" />
          )}
          <p className="uppercase text-[11px] font-bold">Institute Stamp</p>
          <span className="text-[9px] text-ink-muted">{stamp?.label || 'Official Verification Seal'}</span>
        </div>
      </div>
    </div>
  );
};

export default AdmissionFooterRules;
