import { Trash2, AlertTriangle } from 'lucide-react';

const SignatureDeleteModal = ({ target, onClose, onConfirm }) => {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-semibold text-text dark:text-text-dark">Delete {target.is_stamp ? 'Official Stamp' : 'Signature'}?</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Are you sure you want to remove &quot;{target.label}&quot;? Documents currently using this may need a new default selected.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-medium rounded-xl border border-line dark:border-white/10 text-text dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(target._id);
              onClose();
            }}
            className="flex-1 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureDeleteModal;
