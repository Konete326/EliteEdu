import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function CrmDeleteModal({ isOpen, onClose, lead, onConfirm, isDeleting }) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              Delete Inquiry
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-text-muted hover:bg-hover">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-secondary">
          Are you sure you want to delete inquiry for{' '}
          <strong className="text-text-primary dark:text-text-primary-dark">{lead.student_name}</strong>?
          This action will permanently delete all logged conversation history and cannot be undone.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-line dark:border-line-dark text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-line dark:border-line-dark hover:bg-hover font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(lead._id)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-bad text-white font-bold hover:bg-bad/90 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Lead'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
