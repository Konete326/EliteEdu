import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const SettingsFeedbackModal = ({ feedback, onClose }) => {
  if (!feedback) return null;
  const isSuccess = feedback.type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface dark:bg-[#0e0e12] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 text-center space-y-4">
        <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
          isSuccess ? 'bg-good-soft dark:bg-good/20 text-good dark:text-good-dark' : 'bg-bad-soft dark:bg-bad/20 text-bad dark:text-bad-dark'
        }`}>
          {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-ink dark:text-ink-dark">
            {feedback.title}
          </h4>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            {feedback.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
            isSuccess ? 'bg-primary hover:bg-primary-hover' : 'bg-bad hover:bg-bad/90'
          }`}
        >
          Acknowledge
        </button>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-ink-muted hover:text-ink dark:hover:text-ink-dark"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SettingsFeedbackModal;
