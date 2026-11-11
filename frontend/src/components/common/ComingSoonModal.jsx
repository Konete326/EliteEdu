import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock } from 'lucide-react';

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

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-surface dark:bg-[#111116] border border-line dark:border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3.5 top-3.5 w-7 h-7 rounded-xl flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
          <Clock className="w-6 h-6 text-primary" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            <span>{badge}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-ink dark:text-white tracking-tight">
            {title}
          </h3>

          <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default ComingSoonModal;
