import { useState, useEffect } from 'react';
import api from '../../services/api';

let cachedSignatures = null;
let pendingRequest = null;

const loadSignaturesData = () => {
  if (cachedSignatures) return Promise.resolve(cachedSignatures);
  if (!pendingRequest) {
    pendingRequest = api.get('/signatures')
      .then((res) => {
        cachedSignatures = res.data?.data || [];
        return cachedSignatures;
      })
      .catch((err) => {
        pendingRequest = null;
        throw err;
      });
  }
  return pendingRequest;
};

const OfficialSignatureStampBlock = ({
  showStamp = true,
  showSignature = true,
  signatureTitle = 'Signature',
  stampTitle = 'Official Stamp',
  principalSignatureUrl = '',
  compact = false,
  hideControls = false
}) => {
  const [signatures, setSignatures] = useState(() => {
    if (!cachedSignatures) return [];
    return cachedSignatures.filter((s) => !s.is_stamp);
  });
  const [stamps, setStamps] = useState(() => {
    if (!cachedSignatures) return [];
    return cachedSignatures.filter((s) => s.is_stamp && s.image_url);
  });
  const [selectedSigId, setSelectedSigId] = useState(() => {
    if (!cachedSignatures) return '';
    const sigs = cachedSignatures.filter((s) => !s.is_stamp);
    const def = sigs.find((s) => s.is_default) || sigs[0];
    return def ? def._id : '';
  });
  const [selectedStampId, setSelectedStampId] = useState(() => {
    if (!cachedSignatures) return '';
    const stps = cachedSignatures.filter((s) => s.is_stamp && s.image_url);
    const def = stps.find((s) => s.is_default) || stps[0];
    return def ? def._id : '';
  });

  useEffect(() => {
    let mounted = true;
    if (cachedSignatures && signatures.length > 0) return;
    loadSignaturesData()
      .then((list) => {
        if (!mounted) return;
        const sigs = list.filter((s) => !s.is_stamp);
        const stps = list.filter((s) => s.is_stamp && s.image_url);
        setSignatures(sigs);
        setStamps(stps);
        const defSig = sigs.find((s) => s.is_default) || sigs[0];
        const defStp = stps.find((s) => s.is_default) || stps[0];
        if (defSig) setSelectedSigId((prev) => prev || defSig._id);
        if (defStp) setSelectedStampId((prev) => prev || defStp._id);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [signatures.length]);

  const activeSig = signatures.find((s) => s._id === selectedSigId);
  const activeStamp = stamps.find((s) => s._id === selectedStampId);
  const hasUploadedStamp = Boolean(activeStamp && activeStamp.image_url);

  if (!showSignature && (!showStamp || !hasUploadedStamp)) {
    return null;
  }

  return (
    <div className={`w-full max-w-full overflow-hidden select-none ${compact ? 'text-[8px]' : 'text-xs'}`}>
      <div className={`w-full flex items-end justify-center gap-3 ${compact ? 'pt-0.5' : 'pt-2'}`}>
        {showSignature && (
          <div className="w-full max-w-[140px] text-center flex flex-col items-center">
            {activeSig?.image_url || principalSignatureUrl ? (
              <img
                src={activeSig?.image_url || principalSignatureUrl}
                alt={activeSig?.label || signatureTitle}
                className={`${compact ? 'h-6' : 'h-9'} max-w-full object-contain mb-0.5`}
              />
            ) : (
              <div className={`${compact ? 'h-5 w-20' : 'h-6 w-28'} border-b border-slate-400 mb-1`} />
            )}
            {signatureTitle && (
              <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[9px] block leading-tight">
                {signatureTitle}
              </span>
            )}
          </div>
        )}

        {showStamp && hasUploadedStamp && (
          <div className="w-full max-w-[140px] text-center flex flex-col items-center">
            <img src={activeStamp.image_url} alt={activeStamp.label} className={`${compact ? 'h-9' : 'h-12'} max-w-full object-contain rotate-[-4deg] mb-0.5 drop-shadow-2xs`} />
            {stampTitle && <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[9px] block leading-tight">{stampTitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialSignatureStampBlock;
