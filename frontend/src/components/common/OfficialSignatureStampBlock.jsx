import { useState, useEffect } from 'react';
import api from '../../services/api';

const OfficialSignatureStampBlock = ({
  showStamp = true,
  showSignature = true,
  signatureTitle = 'Authority Signature',
  stampTitle = 'Official Stamp',
  compact = false
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
    <div className={`space-y-2 select-none ${compact ? 'text-[8px]' : 'text-xs'}`}>
      {(signatures.length > 1 || stamps.length > 1) && (
        <div className="print:hidden flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-surface-secondary/70 border border-line text-[10px]">
          {showSignature && signatures.length > 0 && (
            <select
              value={selectedSigId}
              onChange={(e) => setSelectedSigId(e.target.value)}
              className="px-2 py-0.5 rounded border border-line bg-surface font-medium outline-none"
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
              className="px-2 py-0.5 rounded border border-line bg-surface font-medium outline-none"
            >
              {stamps.map((s) => (
                <option key={s._id} value={s._id}>{s.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className={`flex items-end justify-between gap-4 ${compact ? 'pt-1' : 'pt-4 border-t border-slate-300'}`}>
        {showSignature && (
          <div className="text-center min-w-[100px] flex flex-col items-center">
            {activeSig ? (
              <img src={activeSig.image_url} alt={activeSig.label} className={`${compact ? 'h-5' : 'h-8'} object-contain mb-0.5`} />
            ) : (
              <div className={`${compact ? 'h-4 w-20' : 'h-6 w-32'} border-b border-slate-400 mb-1`} />
            )}
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{signatureTitle}</span>
            {activeSig?.label && <span className="text-[9px] text-slate-400 block">{activeSig.label}</span>}
          </div>
        )}

        {showStamp && (
          <div className="text-center min-w-[100px] flex flex-col items-center">
            {activeStamp ? (
              <img src={activeStamp.image_url} alt={activeStamp.label} className={`${compact ? 'h-6' : 'h-10'} object-contain rotate-[-4deg] mb-0.5`} />
            ) : (
              <div className={`${compact ? 'h-4 w-20' : 'h-6 w-32'} border-b border-slate-400 mb-1`} />
            )}
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{stampTitle}</span>
            {activeStamp?.label && <span className="text-[9px] text-slate-400 block">{activeStamp.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialSignatureStampBlock;
