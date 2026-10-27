import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, ChevronRight, ChevronLeft, Check, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TeacherOnboardingSteps from './onboarding/TeacherOnboardingSteps';
import AdminOnboardingSteps from './onboarding/AdminOnboardingSteps';
import StudentOnboardingSteps from './onboarding/StudentOnboardingSteps';

const STEP_TITLES = {
  Teacher: [
    { number: 1, title: 'Identity', subtitle: 'Personal profile & details' },
    { number: 2, title: 'Contacts', subtitle: 'Phone & emergency channels' },
    { number: 3, title: 'Academic', subtitle: 'Degree & teaching history' },
    { number: 4, title: 'Security', subtitle: 'Password & account protection' }
  ],
  Admin: [
    { number: 1, title: 'School Info', subtitle: 'General name & branding' },
    { number: 2, title: 'Affiliation', subtitle: 'Session & board details' },
    { number: 3, title: 'Location', subtitle: 'School address & contacts' },
    { number: 4, title: 'Master Security', subtitle: 'Admin credentials & password' }
  ],
  Student: [
    { number: 1, title: 'Profile', subtitle: 'Student identity & bio' },
    { number: 2, title: 'Guardian', subtitle: 'Parent & emergency contacts' },
    { number: 3, title: 'Address', subtitle: 'Home location & city' },
    { number: 4, title: 'Security', subtitle: 'Portal access password' }
  ]
};

const OnboardingWizardModal = () => {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = user?.role === 'Admin' ? 'Admin' : user?.role === 'Student' ? 'Student' : 'Teacher';
  const stepsList = STEP_TITLES[role] || STEP_TITLES.Teacher;

  const [form, setForm] = useState({});

  useEffect(() => {
    if (!user) return;
    if (user.role === 'SuperAdmin') {
      setIsOpen(false);
      return;
    }

    const needsOnboarding = user.first_login === true || user.onboarding_completed === false;
    if (needsOnboarding) {
      setIsOpen(true);
      setForm({
        name: user.name || '',
        school_name: user.school_name || '',
        slogan: user.school_slogan || '',
        school_type: user.school_type || 'Private',
        contact_number: user.contact_number || '',
        school_phone: user.contact_number || '',
        school_email: user.email || '',
        gender: user.gender || 'Male',
        currency: 'PKR',
        academic_session: '2025-2026'
      });
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }, []);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (role === 'Admin' && (!form.school_name || !form.school_name.trim())) {
        setError('Please enter institution / school name to proceed.');
        return;
      }
      if (role !== 'Admin' && (!form.name || !form.name.trim())) {
        setError('Please enter your full name to proceed.');
        return;
      }
    }
    if (step === 4) {
      if (form.new_password && form.confirm_password && form.new_password !== form.confirm_password) {
        setError('Passwords do not match. Please verify your confirmation password.');
        return;
      }
      if (form.new_password && form.new_password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/complete-onboarding', { skip: true });
      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ onboarding_completed: true, first_login: false });
      }
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to skip onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.new_password && form.confirm_password && form.new_password !== form.confirm_password) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      setError('');
      const payload = { ...form, skip: false };
      const res = await api.post('/auth/complete-onboarding', payload);
      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ onboarding_completed: true, first_login: false });
      }
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = useMemo(() => Math.round((step / 4) * 100), [step]);

  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-surface-dark-secondary/40">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-ink dark:text-ink-dark">
                  {role === 'Admin'
                    ? 'School Setup & General Configuration'
                    : role === 'Student'
                    ? 'Student Portal Quick Onboarding'
                    : 'Teacher Profile & Portal Setup'}
                </h3>
                <p className="text-xs text-ink-muted">
                  Step {step} of 4 • {stepsList[step - 1]?.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-ink-dark px-3 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-surface-secondary transition-colors"
            >
              Skip Setup
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-2.5">
            {stepsList.map((s) => {
              const isDone = s.number < step;
              const isCurrent = s.number === step;
              return (
                <div
                  key={s.number}
                  className={`flex flex-col gap-1 p-2 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-2xs'
                      : isDone
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 font-semibold'
                      : 'border-line dark:border-line-dark text-ink-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      {isDone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : `${s.number}.`}
                      <span className="truncate">{s.title}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full h-1.5 bg-line/50 dark:bg-line-dark/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {role === 'Teacher' && (
            <TeacherOnboardingSteps step={step} form={form} onChange={handleChange} />
          )}
          {role === 'Admin' && (
            <AdminOnboardingSteps step={step} form={form} onChange={handleChange} />
          )}
          {role === 'Student' && (
            <StudentOnboardingSteps step={step} form={form} onChange={handleChange} />
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-line dark:border-line-dark bg-surface-secondary/20 dark:bg-surface-dark-secondary/20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-line dark:border-line-dark transition-all ${
              step === 1
                ? 'opacity-30 cursor-not-allowed text-ink-muted'
                : 'text-ink dark:text-ink-dark hover:bg-surface-secondary active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              Skip for Now
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm active:scale-95 transition-all"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-95 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Complete Setup &amp; Launch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default OnboardingWizardModal;
