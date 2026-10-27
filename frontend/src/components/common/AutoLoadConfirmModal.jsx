import { createPortal } from 'react-dom';
import { X, GraduationCap, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

const AutoLoadConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Load Standard Subjects',
  description = 'Load standard subjects for your school.',
  targetName = 'All Campuses',
  icon: HeaderIcon = GraduationCap,
  features = [
    'Loads standard subjects from Class 1 to Class 10',
    'Your existing subjects will not be changed or deleted',
    'Sets default subject codes, categories, and marks'
  ],
  sequencePreview = null
}) => {
  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
              <HeaderIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">{title}</h3>
              <p className="text-xs text-ink-muted mt-0.5">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-ink-muted hover:text-ink dark:hover:text-white p-1 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-line/60 dark:border-white/5">
            <span className="text-ink-muted font-medium">Target</span>
            <span className="font-semibold text-primary dark:text-primary-dark">{targetName}</span>
          </div>
          <ul className="space-y-1.5">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink dark:text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-good shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          {sequencePreview && sequencePreview.length > 0 && (
            <div className="pt-2 border-t border-line/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                Class Sequence:
              </span>
              <div className="flex flex-wrap gap-1">
                {sequencePreview.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-ink-muted px-1">
          <ShieldCheck className="w-4 h-4 text-good shrink-0" />
          <span>Your existing subjects will not be changed or overwritten.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:bg-surface-secondary transition-all disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm shadow-primary/25 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading Subjects...</span>
              </>
            ) : (
              <span>Confirm & Load</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default AutoLoadConfirmModal;