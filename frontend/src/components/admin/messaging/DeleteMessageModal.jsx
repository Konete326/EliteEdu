import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteMessageModal = ({ isOpen, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-2xl max-w-sm w-full p-5 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="absolute right-4 top-4 p-1.5 text-ink-muted hover:text-ink rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Delete Message</h3>
        <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-1">
          Are you sure you want to delete this message?
        </p>

        <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-line dark:border-line-dark">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
