import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldCheck, ShieldAlert, GraduationCap, Calendar, WifiOff, Camera } from 'lucide-react';
import EmergencyMedicalCard from '../../components/public/EmergencyMedicalCard';
import { resolveOfflineStudentRecord } from '../../utils/offlineVerificationResolver';
import CameraScannerModal from '../../components/common/scanner/CameraScannerModal';

const StudentEmergencyVerifyPage = () => {
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
    api.get(`/public/verify-student/${id}`)
      .then((res) => {
        if (isMounted && res.data.success) {
          setData(res.data.data);
          localStorage.setItem(`eliteedu_student_${id}`, JSON.stringify(res.data.data));
        }
      })
      .catch((err) => {
        const offlineRecord = resolveOfflineStudentRecord(id);
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
    if (clean.includes('/verify/student/')) {
      const parts = clean.split('/verify/student/');
      clean = parts[parts.length - 1].split('?')[0].trim();
    }
    setIsCameraOpen(false);
    navigate(`/verify/student/${clean}`);
    return { success: true, student: { name: clean } };
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
          <h2 className="text-lg font-bold text-ink dark:text-ink-dark">Student Verification Failed</h2>
          <p className="text-xs text-ink-muted">{error || 'Record could not be verified on the institutional database.'}</p>
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
          title="Scan Student ID QR"
          subtitle="Align Student ID card QR to verify emergency details"
        />
      </div>
    );
  }

  const { name, father_name, gr_number, photo_url, status, admission_date, current_grade, current_section, emergency, institution, isOffline } = data;
  const isActive = status === 'Active';
  const doaFormatted = admission_date ? new Date(admission_date).toLocaleDateString('en-GB') : '—';
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';

  return (
    <div className="min-h-screen bg-bg dark:bg-[#08080a] py-6 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-4">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-primary-dark">Official Institutional Verification</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-surface dark:bg-surface-dark border border-line text-[11px] font-bold text-ink hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Camera size={13} />
              <span>Scan Next</span>
            </button>
            <span className="text-[11px] font-mono text-ink-muted">GR #{gr_number}</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
        }`}>
          <div className="flex items-center gap-2.5">
            {isOffline ? <WifiOff className="w-6 h-6 shrink-0 text-amber-500" /> : <ShieldCheck className="w-6 h-6 shrink-0" />}
            <div>
              <p className="text-xs font-black uppercase tracking-wide">
                {isOffline ? 'Offline Verified (QR Payload)' : (isActive ? 'Verified Active Student' : `Status: ${status}`)}
              </p>
              <p className="text-[11px] opacity-80">{institution?.school_name} • {institution?.campus_name}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
            {status || 'Active'}
          </span>
        </div>

        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-secondary border border-line overflow-hidden flex items-center justify-center font-bold text-lg text-primary shrink-0">
              {photo_url ? (
                <img src={photo_url} alt={name} className="w-full h-full object-cover" />
              ) : (initials)}
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-base font-extrabold text-ink dark:text-ink-dark truncate">{name}</h2>
              <p className="text-xs text-ink-muted">S/O or D/O: <span className="font-semibold text-ink dark:text-ink-dark">{father_name || '—'}</span></p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold">
                  <GraduationCap className="w-3.5 h-3.5" /> Class: {current_grade} ({current_section || 'A'})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-secondary text-ink-muted font-medium">
                  <Calendar className="w-3.5 h-3.5" /> DOA: {doaFormatted}
                </span>
              </div>
            </div>
          </div>

          <EmergencyMedicalCard emergency={emergency} institution={institution} />
        </div>
      </div>

      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={handleCameraScan}
        title="Scan Student ID QR"
        subtitle="Align Student ID card QR to verify emergency details"
      />
    </div>
  );
};

export default StudentEmergencyVerifyPage;
