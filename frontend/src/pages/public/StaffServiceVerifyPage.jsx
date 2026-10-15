import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldCheck, ShieldAlert, Award, Building2, Calendar, Phone, ArrowLeft, Mail } from 'lucide-react';

const StaffServiceVerifyPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.get(`/public/verify-staff/${id}`)
      .then((res) => {
        if (isMounted && res.data.success) setData(res.data.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || 'Verification link expired or invalid');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-[#08080a] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg dark:bg-[#08080a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 text-center space-y-4 shadow-lg">
          <ShieldAlert className="w-12 h-12 text-bad mx-auto" />
          <h2 className="text-lg font-bold text-ink dark:text-ink-dark">Faculty Verification Failed</h2>
          <p className="text-xs text-ink-muted">{error || 'Staff service record could not be verified on the database.'}</p>
          <Link to="/login" className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white">Return to Portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-[#08080a] flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-lg w-full mx-auto space-y-4">
        <div className="bg-surface dark:bg-[#0c0c0f] border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
              <div>
                <h3 className="font-bold text-xs text-ink dark:text-ink-dark uppercase">{data.institution?.school_name}</h3>
                <p className="text-[10px] text-ink-muted">Education Department Verification</p>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Staff
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center font-bold text-lg text-primary shrink-0">
              {data.photo_url ? (
                <img src={data.photo_url} alt={data.name} className="w-full h-full object-cover" />
              ) : data.name[0]}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-base font-extrabold text-ink dark:text-ink-dark truncate">{data.name}</h2>
              <p className="text-xs font-bold text-primary dark:text-primary-dark">
                {data.designation} {data.bps_grade ? `(BPS-${data.bps_grade})` : ''}
              </p>
              <p className="text-[11px] text-ink-muted font-mono">
                Pers #: {data.personal_id || data.employee_code || '—'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
              <p className="text-[10px] font-bold text-ink-muted">Place of Posting</p>
              <p className="font-bold text-ink dark:text-ink-dark mt-0.5 truncate">{data.institution?.campus_name}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
              <p className="text-[10px] font-bold text-ink-muted">SEMIS Code</p>
              <p className="font-mono font-bold text-ink dark:text-ink-dark mt-0.5">{data.semis_code || '408110114'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
              <p className="text-[10px] font-bold text-ink-muted">Blood Group</p>
              <p className="font-bold text-red-600 mt-0.5">{data.blood_group || 'O+'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
              <p className="text-[10px] font-bold text-ink-muted">Service Status</p>
              <p className="font-bold text-good mt-0.5">{data.status || 'Active'}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-primary">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffServiceVerifyPage;
