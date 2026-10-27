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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden">
        <div className="p-3.5 sm:p-5 sm:pb-4 border-b border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-surface-dark-secondary/40 shrink-0">
          <div className="flex items-center justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-ink dark:text-ink-dark truncate">
                  {role === 'Admin'
                    ? 'School Setup & Configuration'
                    : role === 'Student'
                    ? 'Student Portal Quick Setup'
                    : 'Teacher Profile & Portal Setup'}
                </h3>
                <p className="text-[11px] sm:text-xs text-ink-muted truncate">
                  Step {step} of 4 • <span className="font-semibold text-ink dark:text-ink-dark">{stepsList[step - 1]?.title}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="shrink-0 text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-ink-dark px-2.5 sm:px-3 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              Skip Setup
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
            {stepsList.map((s) => {
              const isDone = s.number < step;
              const isCurrent = s.number === step;
              return (
                <div
                  key={s.number}
                  className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-xl border transition-all text-center sm:text-left ${
                    isCurrent
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : isDone
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold'
                      : 'border-line dark:border-line-dark text-ink-muted opacity-60'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="text-[11px] sm:text-xs font-bold shrink-0">{s.number}.</span>
                  )}
                  <span className="text-[11px] sm:text-xs truncate hidden sm:inline">{s.title}</span>
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
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

        <div className="p-3 sm:p-4 md:p-5 border-t border-line dark:border-line-dark bg-surface-secondary/20 dark:bg-surface-dark-secondary/20 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border border-line dark:border-line-dark transition-all cursor-pointer ${
                step === 1
                  ? 'opacity-30 cursor-not-allowed text-ink-muted'
                  : 'text-ink dark:text-ink-dark hover:bg-surface-secondary active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors cursor-pointer text-center"
            >
              Skip Setup
            </button>
          </div>

          <div className="w-full sm:w-auto">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 shrink-0" />
                )}
                <span>Complete &amp; Launch</span>
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
