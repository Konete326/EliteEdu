import { useEffect } from 'react';
import { X } from 'lucide-react';

const ComingSoonModal = ({
  isOpen,
  onClose,
  title = 'Feature Coming Soon',
  description = 'We are currently putting the finishing touches on this module. It will be available in an upcoming release.',
  badge = 'Coming Soon'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-surface/95 dark:bg-[#111116]/95 backdrop-blur-xl border border-line/80 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-32 bg-primary/15 dark:bg-primary/25 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-1">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-3xl blur-xl opacity-70 dark:opacity-90" />
            <div className="relative w-20 h-20 rounded-2xl bg-surface-secondary/80 dark:bg-white/[0.04] border border-line/80 dark:border-white/10 p-3.5 shadow-lg flex items-center justify-center backdrop-blur-md">
              <img
                src="/logo.png"
                alt="EliteEdu Logo"
                className="w-full h-full object-contain drop-shadow-md select-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>{badge}</span>
            </div>

            <h3 className="text-xl font-bold text-ink dark:text-white tracking-tight">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-ink-sub dark:text-ink-sub-dark leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          </div>

          <div className="w-full p-3.5 rounded-2xl bg-surface-secondary/60 dark:bg-white/[0.03] border border-line/60 dark:border-white/5 flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark">
            <span className="font-medium">Module Status</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Active Development
            </span>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md shadow-primary/20 active:scale-[0.99] cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
