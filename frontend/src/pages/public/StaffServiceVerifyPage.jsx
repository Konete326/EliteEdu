import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldCheck, ShieldAlert, WifiOff, ArrowLeft, Camera } from 'lucide-react';
import { resolveOfflineStaffRecord } from '../../utils/offlineVerificationResolver';
import StaffVerifyDetailsCard from '../../components/public/StaffVerifyDetailsCard';
import CameraScannerModal from '../../components/common/scanner/CameraScannerModal';

const StaffServiceVerifyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    api.get(`/public/verify-staff/${id}`)
      .then((res) => {
        if (isMounted && res.data.success) {
          setData(res.data.data);
          localStorage.setItem(`eliteedu_staff_${id}`, JSON.stringify(res.data.data));
        }
      })
      .catch((err) => {
        const offlineRecord = resolveOfflineStaffRecord(id);
        if (isMounted) {
          if (offlineRecord) {
            setData(offlineRecord);
          } else {
            setError(err.response?.data?.message || 'Verification record not found offline');
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  const handleCameraScan = (code) => {
    let clean = String(code || '').trim();
    if (clean.includes('/verify/staff/')) {
      const parts = clean.split('/verify/staff/');
      clean = parts[parts.length - 1].split('?')[0].trim();
    }
    setIsCameraOpen(false);
    navigate(`/verify/staff/${clean}`);
    return { success: true, staff: { name: clean } };
  };

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
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Camera size={14} />
              <span>Scan QR with Camera</span>
            </button>
            <Link to="/login" className="px-4 py-2 text-xs font-bold rounded-xl border border-line text-ink">Login</Link>
          </div>
        </div>
        <CameraScannerModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onScan={handleCameraScan}
          title="Scan Staff Service QR"
          subtitle="Align teacher service card QR to verify records"
        />
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-surface-secondary border border-line text-[11px] font-bold text-ink hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                title="Scan Another Staff Card"
              >
                <Camera size={13} />
                <span>Scan Next</span>
              </button>
              {data.isOffline ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <WifiOff className="w-3.5 h-3.5" /> Offline
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center font-bold text-lg text-primary shrink-0">
              {data.photo_url ? (
                <img src={data.photo_url} alt={data.name} className="w-full h-full object-cover" />
              ) : (data.name ? data.name[0] : 'S')}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-base font-extrabold text-ink dark:text-ink-dark truncate">{data.name}</h2>
              <p className="text-xs font-bold text-primary dark:text-primary-dark">
                {data.designation} {data.bps_grade ? `(BPS-${String(data.bps_grade).replace(/^BPS[-_\s]*/i, '').trim()})` : ''}
              </p>
              <p className="text-[11px] text-ink-muted font-mono">
                Pers #: {data.personal_id || data.employee_code || '—'}
              </p>
            </div>
          </div>

          <StaffVerifyDetailsCard data={data} />
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-primary">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </div>

      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={handleCameraScan}
        title="Scan Staff Service QR"
        subtitle="Align teacher service card QR to verify records"
      />
    </div>
  );
};

export default StaffServiceVerifyPage;
