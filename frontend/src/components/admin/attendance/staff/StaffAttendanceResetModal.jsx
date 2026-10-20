import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const StaffAttendanceResetModal = ({ isOpen, onClose, onConfirm, date, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink dark:text-ink-dark">
              Reset Attendance for {date}?
            </h3>
            <p className="text-xs text-ink-sub dark:text-ink-sub-dark leading-relaxed">
              This will permanently delete all attendance marks for this date. All staff members will revert to unmarked.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-secondary dark:bg-surface-secondary-dark hover:bg-line dark:hover:bg-line-dark text-ink dark:text-ink-dark transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Confirm Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceResetModal;
