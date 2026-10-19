import { useState, useEffect } from 'react';
import api from '../../services/api';

const OfficialSignatureStampBlock = ({
  showStamp = true,
  showSignature = true,
  signatureTitle = 'Authority Signature',
  stampTitle = 'Official Stamp',
  compact = false,
  hideControls = false
}) => {
  const [signatures, setSignatures] = useState([]);
  const [stamps, setStamps] = useState([]);
  const [selectedSigId, setSelectedSigId] = useState('');
  const [selectedStampId, setSelectedStampId] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/signatures')
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.data || [];
        const sigs = list.filter((s) => !s.is_stamp);
        const stps = list.filter((s) => s.is_stamp);
        setSignatures(sigs);
        setStamps(stps);
        const defSig = sigs.find((s) => s.is_default) || sigs[0];
        const defStp = stps.find((s) => s.is_default) || stps[0];
        if (defSig) setSelectedSigId(defSig._id);
        if (defStp) setSelectedStampId(defStp._id);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const activeSig = signatures.find((s) => s._id === selectedSigId);
  const activeStamp = stamps.find((s) => s._id === selectedStampId);

  return (
    <div className={`w-full max-w-full overflow-hidden select-none ${compact ? 'text-[8px]' : 'text-xs'}`}>
      {!hideControls && (signatures.length > 1 || stamps.length > 1) && (
        <div className="print:hidden flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-lg bg-surface-secondary/70 border border-line text-[9px] mb-2">
          {showSignature && signatures.length > 0 && (
            <select
              value={selectedSigId}
              onChange={(e) => setSelectedSigId(e.target.value)}
              className="px-1.5 py-0.5 rounded border border-line bg-surface font-medium outline-none text-[9px]"
            >
              {signatures.map((s) => (
                <option key={s._id} value={s._id}>{s.label}</option>
              ))}
            </select>
          )}
          {showStamp && stamps.length > 0 && (
            <select
              value={selectedStampId}
              onChange={(e) => setSelectedStampId(e.target.value)}
              className="px-1.5 py-0.5 rounded border border-line bg-surface font-medium outline-none text-[9px]"
            >
              {stamps.map((s) => (
                <option key={s._id} value={s._id}>{s.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className={`w-full flex items-end justify-center gap-3 ${compact ? 'pt-0.5' : 'pt-2'}`}>
        {showSignature && (
          <div className="w-full max-w-[140px] text-center flex flex-col items-center">
            {activeSig ? (
              <img src={activeSig.image_url} alt={activeSig.label} className={`${compact ? 'h-6' : 'h-9'} max-w-full object-contain mb-0.5`} />
            ) : (
              <div className={`${compact ? 'h-5 w-20' : 'h-6 w-28'} border-b border-slate-400 mb-1`} />
            )}
            {signatureTitle && <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[9px] block leading-tight">{signatureTitle}</span>}
          </div>
        )}

        {showStamp && (
          <div className="w-full max-w-[140px] text-center flex flex-col items-center">
            {activeStamp ? (
              <img src={activeStamp.image_url} alt={activeStamp.label} className={`${compact ? 'h-9' : 'h-12'} max-w-full object-contain rotate-[-4deg] mb-0.5 drop-shadow-2xs`} />
            ) : (
              <div className={`${compact ? 'h-7 w-16' : 'h-9 w-20'} border border-dashed border-slate-400 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 mb-0.5`}>SEAL</div>
            )}
            {stampTitle && <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[9px] block leading-tight">{stampTitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialSignatureStampBlock;
