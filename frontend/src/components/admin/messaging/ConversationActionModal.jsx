import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, Download, X } from 'lucide-react';

const ConversationActionModal = ({
  isOpen,
  title,
  description,
  confirmText,
  variant = 'danger',
  onClose,
  onConfirm
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  const iconBg = isDanger
    ? 'bg-rose-500/10 text-rose-500'
    : isWarning
    ? 'bg-amber-500/10 text-amber-500'
    : 'bg-primary/10 text-primary';

  const btnBg = isDanger
    ? 'bg-rose-600 hover:bg-rose-700'
    : isWarning
    ? 'bg-amber-600 hover:bg-amber-700'
    : 'bg-primary hover:bg-primary-hover';

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-2xl max-w-sm w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 p-1.5 text-ink-muted hover:text-ink rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${iconBg}`}>
          {isDanger ? (
            <Trash2 className="w-5 h-5" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </div>

        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">{title}</h3>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1.5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-line dark:border-line-dark">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={submitting}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs ${btnBg}`}
          >
            {submitting ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConversationActionModal;
