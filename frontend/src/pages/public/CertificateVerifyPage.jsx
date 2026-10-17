import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ShieldCheck, Award, Calendar, GraduationCap } from 'lucide-react';
import api from '../../services/api';

const CertificateVerifyPage = () => {
  const { certNo } = useParams();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/api/public/verify-certificate/${certNo}`)
      .then((res) => setCert(res.data.certificate))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [certNo]);

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
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 p-6 rounded-2xl max-w-md w-full text-center space-y-3 shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certificate Verification Failed</h2>
          <p className="text-xs text-slate-500">No official record exists for serial #{certNo}. This certificate may be invalid or revoked.</p>
        </div>
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
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
            {cert.certificate_no}
          </span>
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

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
            <span className="text-slate-500">Issued To:</span>
            <strong className="text-slate-900 dark:text-white">{cert.recipient_name}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
            <span className="text-slate-500">Father / Guardian:</span>
            <span>{cert.father_name || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
            <span className="text-slate-500">Class / Designation:</span>
            <span>{cert.class_or_designation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Issue Date:</span>
            <span className="font-mono">{new Date(cert.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-serif text-center leading-relaxed italic bg-amber-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/20">
          "{cert.resolved_body}"
        </p>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1 font-semibold"><ShieldCheck size={13} className="text-emerald-500" /> Digital Ledger Verified</span>
          <span className="flex items-center gap-0.5 font-bold"><GraduationCap size={13} className="text-primary" /> EliteEdu Credential Service</span>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
