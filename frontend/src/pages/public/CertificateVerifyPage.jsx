import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ShieldCheck, GraduationCap, Camera } from 'lucide-react';
import api from '../../services/api';
import CameraScannerModal from '../../components/common/scanner/CameraScannerModal';
import CertificateVerifyDetails from './CertificateVerifyDetails';

const CertificateVerifyPage = () => {
  const { certNo } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get(`/public/verify-certificate/${certNo}`)
      .then((res) => setCert(res.data.certificate))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [certNo]);

  const handleCameraScan = (code) => {
    let clean = String(code || '').trim();
    if (clean.includes('/verify/certificate/')) {
      const parts = clean.split('/verify/certificate/');
      clean = parts[parts.length - 1].split('?')[0].trim();
    }
    setIsCameraOpen(false);
    navigate(`/verify/certificate/${clean}`);
    return { success: true, recipient_name: clean };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Verifying institutional certificate...</p>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certificate Verification Failed</h2>
          <p className="text-xs text-slate-500">No official record exists for serial #{certNo}. This certificate may be invalid or revoked.</p>
          <button type="button" onClick={() => setIsCameraOpen(true)} className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto cursor-pointer hover:bg-primary-hover transition-all">
            <Camera className="w-4 h-4" /> <span>Scan QR with Camera</span>
          </button>
        </div>
        <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onScan={handleCameraScan} title="Scan Certificate QR" subtitle="Align printed certificate QR code to verify record" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/30 p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={24} />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">Officially Verified Credential</h2>
              <p className="text-[10px] text-slate-500">Authentic School Record Guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsCameraOpen(true)} className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer" title="Scan Another Certificate">
              <Camera size={14} /><span className="hidden sm:inline">Scan</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
              {cert.certificate_no}
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-lg font-black uppercase text-slate-900 dark:text-white">{cert.school_id?.name || 'INSTITUTION'}</h1>
          <p className="text-xs text-slate-500">{cert.campus_id?.name} {cert.campus_id?.address ? `— ${cert.campus_id.address}` : ''}</p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              {cert.heading || cert.template_name}
            </span>
          </div>
        </div>

        <CertificateVerifyDetails cert={cert} />

        <p className="text-xs text-slate-700 dark:text-slate-300 font-serif text-center leading-relaxed italic bg-amber-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/20">
          "{cert.resolved_body}"
        </p>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1 font-semibold"><ShieldCheck size={13} className="text-emerald-500" /> Digital Ledger Verified</span>
          <span className="flex items-center gap-0.5 font-bold"><GraduationCap size={13} className="text-primary" /> EliteEdu Credential Service</span>
        </div>
      </div>

      <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onScan={handleCameraScan} title="Scan Certificate QR" subtitle="Align printed certificate QR code to verify record" />
    </div>
  );
};

export default CertificateVerifyPage;
