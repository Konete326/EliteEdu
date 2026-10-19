import { X, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

const AutoLoadConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Auto-Load Standard Data',
  description = 'Automatically seed pre-configured academic standards for your institution.',
  targetName = 'All Campuses',
  features = [
    'Loads official standard courses from Class 1 to Class 10',
    'Maintains data integrity without deleting your existing items',
    'Assigns default subject codes, categories, and credit configurations'
  ],
  sequencePreview = null
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">{title}</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-ink-muted hover:text-ink dark:hover:text-ink-dark p-1 rounded-lg transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-line/60 dark:border-white/5">
            <span className="text-ink-muted dark:text-ink-muted-dark font-medium">Target Scope</span>
            <span className="font-semibold text-primary dark:text-primary-dark">{targetName}</span>
          </div>
          <ul className="space-y-1.5">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-sub dark:text-ink-sub-dark">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          {sequencePreview && sequencePreview.length > 0 && (
            <div className="pt-2 border-t border-line/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                Standard Class Sequence:
              </span>
              <div className="flex flex-wrap gap-1">
                {sequencePreview.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 rounded-md bg-primary-soft/80 dark:bg-primary/20 text-primary dark:text-primary-dark text-[10px] font-bold border border-primary/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-ink-muted-dark px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Safe action: existing classes and customized subjects will not be overwritten.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary transition-all disabled:opacity-40 cursor-pointer"
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
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auto-Loading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Auto-Load</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoLoadConfirmModal;
