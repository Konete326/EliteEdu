import { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';
import { emitToastSuccess, emitToastError } from '../../../utils/toastEvents';

const ResetSchoolDataModal = ({ isOpen, onClose, schoolName }) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (confirmText.trim() !== 'RESET SCHOOL') return;
    setLoading(true);
    try {
      const res = await api.post('/schools/reset-data');
      if (res.data?.success) {
        setResult(res.data.summary);
        emitToastSuccess('All school data has been successfully reset');
      }
    } catch (err) {
      emitToastError(err.response?.data?.message || 'Failed to reset school data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-surface dark:bg-[#121217] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
            <div className="p-2 rounded-xl bg-red-500/10">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Purge School Data</h3>
              <p className="text-[11px] text-ink-muted">Destructive action for {schoolName || 'this school'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {result ? (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Purge completed successfully. All school records cleared.</span>
            </div>
            <div className="text-[11px] space-y-1 text-ink-muted bg-surface-secondary/40 dark:bg-[#181820] p-3 rounded-xl">
              <p>Students removed: <span className="font-bold text-ink dark:text-ink-dark">{result.studentsDeleted || 0}</span></p>
              <p>Staff removed: <span className="font-bold text-ink dark:text-ink-dark">{result.staffDeleted || 0}</span></p>
              <p>Campuses removed: <span className="font-bold text-ink dark:text-ink-dark">{result.campusesDeleted || 0}</span></p>
              <p>Invoices removed: <span className="font-bold text-ink dark:text-ink-dark">{result.invoicesDeleted || 0}</span></p>
            </div>
            <button type="button" onClick={() => window.location.reload()} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer">
              Reload Application
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-ink-muted leading-relaxed">
              This will permanently delete all <strong className="text-red-500">students, teachers, staff accounts, campuses, attendance, fee records, and messages</strong> associated strictly with your school. Your admin account will be safely kept. Other schools are never affected.
            </p>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink dark:text-ink-dark">
                Type <span className="text-red-500 font-mono">RESET SCHOOL</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="RESET SCHOOL"
                className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary dark:bg-[#1a1a24] border border-line dark:border-line-dark focus:border-red-500 outline-hidden font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded-xl text-xs font-bold border border-line dark:border-line-dark hover:bg-surface-secondary cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || confirmText.trim() !== 'RESET SCHOOL'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{loading ? 'Wiping Data...' : 'Confirm Purge'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetSchoolDataModal;
