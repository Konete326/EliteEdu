import { useEffect } from 'react';
import { GraduationCap, X, Calendar, Receipt, Award } from 'lucide-react';

const StudentComingSoonModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-[420px] bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-soft text-accent-ink dark:bg-accent/20 dark:text-accent-dark text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Coming Soon
            </div>
            <h3 className="text-base font-bold text-ink dark:text-ink-dark">
              Student & Parent Portal
            </h3>
          </div>
        </div>

        <p className="text-xs text-ink-sub dark:text-ink-sub-dark leading-relaxed mb-4">
          Student aur Parent digital access portal is waqt active development phase mein hai. Bohot jald yeh tamam features is portal par live honge:
        </p>

        <div className="space-y-2.5 bg-surface-secondary dark:bg-surface-secondary-dark/60 p-3.5 rounded-2xl border border-line dark:border-line-dark mb-5">
          <div className="flex items-center gap-2.5 text-xs text-ink dark:text-ink-dark font-medium">
            <Receipt className="w-4 h-4 text-primary shrink-0" />
            <span>Online Fee Challans & Instant Verification</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-ink dark:text-ink-dark font-medium">
            <Award className="w-4 h-4 text-primary shrink-0" />
            <span>Term Examination Results & Report Cards</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-ink dark:text-ink-dark font-medium">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>Real-time Attendance & Class Timetables</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-primary/20 cursor-pointer text-center"
        >
          Got It, Thanks
        </button>
      </div>
    </div>
  );
};

export default StudentComingSoonModal;
