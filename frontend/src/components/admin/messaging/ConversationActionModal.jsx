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
    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
    : isWarning
    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600';

  const btnBg = isDanger
    ? 'bg-rose-600 hover:bg-rose-700'
    : isWarning
    ? 'bg-amber-600 hover:bg-amber-700'
    : 'bg-[#1e1b4b] hover:bg-indigo-950';

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
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

        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
