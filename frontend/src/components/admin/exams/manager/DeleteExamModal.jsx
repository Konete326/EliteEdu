import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteExamModal({ isOpen, onClose, onConfirm, examTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button type="button" onClick={onClose} className="p-1 text-text-muted hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">Delete Examination</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-text-primary dark:text-text-primary-dark">"{examTitle}"</span>? This will permanently remove the exam, schedule, and all associated marks sheets.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark text-text-muted hover:text-text-primary">
            Cancel
          </button>
          <button type="button" disabled={isDeleting} onClick={onConfirm} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}
