import { useEffect } from 'react';
import { X, Sparkles, Rocket } from 'lucide-react';

const ComingSoonModal = ({
  isOpen,
  onClose,
  title = 'Feature Coming Soon',
  description = "We are currently putting the finishing touches on this feature. It will be available in an upcoming release.",
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-indigo-500/20 text-primary dark:text-primary-dark flex items-center justify-center border border-primary/20 shadow-inner">
              <Rocket className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark border border-primary/20">
              {badge}
            </span>
            <h3 className="text-lg font-bold text-ink dark:text-ink-dark">
              {title}
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed max-w-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/20 active:scale-[0.98]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
