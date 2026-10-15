import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, GraduationCap, Building2, Calendar, Hash, ArrowLeft } from 'lucide-react';
import EmergencyMedicalCard from '../../components/public/EmergencyMedicalCard';

const StudentEmergencyVerifyPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    axios.get(`/api/public/verify-student/${id}`)
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
          <h2 className="text-lg font-bold text-ink dark:text-ink-dark">Student Verification Failed</h2>
          <p className="text-xs text-ink-muted">{error || 'Record could not be verified on the institutional database.'}</p>
          <Link to="/login" className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white">Return to Portal</Link>
        </div>
      </div>
    );
  }

  const { name, father_name, gr_number, photo_url, status, admission_date, current_grade, current_section, emergency, institution } = data;
  const isActive = status === 'Active';
  const doaFormatted = admission_date ? new Date(admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';

  return (
    <div className="min-h-screen bg-bg dark:bg-[#08080a] py-6 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-4">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-primary-dark">Official Institutional Verification</span>
          <span className="text-[11px] font-mono text-ink-muted">GR #{gr_number}</span>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
        }`}>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide">{isActive ? 'Verified Active Student' : `Status: ${status}`}</p>
              <p className="text-[11px] opacity-80">{institution.school_name} • {institution.campus_name}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">LIVE</span>
        </div>

        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-24 rounded-xl border border-line dark:border-white/10 bg-surface-secondary overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl text-ink-muted shadow-xs">
              {photo_url ? <img src={photo_url} alt={name} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="text-base sm:text-lg font-black text-ink dark:text-ink-dark truncate">{name}</h1>
              <p className="text-xs text-ink-muted truncate">S/O {father_name || '—'}</p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold">
                  <GraduationCap className="w-3.5 h-3.5" /> Class: {current_grade} ({current_section})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-secondary text-ink-muted font-medium">
                  <Calendar className="w-3.5 h-3.5" /> DOA: {doaFormatted}
                </span>
              </div>
            </div>
          </div>

          <EmergencyMedicalCard emergency={emergency} institution={institution} />

          <div className="pt-3 border-t border-line/60 dark:border-line-dark text-center space-y-1">
            <p className="text-xs font-bold text-ink dark:text-ink-dark">{institution.campus_name}</p>
            <p className="text-[11px] text-ink-muted">{institution.campus_address}</p>
            <a href={institution.campus_website} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline block font-medium">
              {institution.campus_website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEmergencyVerifyPage;
