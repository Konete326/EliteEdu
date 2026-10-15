import { useState } from 'react';
import { X, KeyRound, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

const ChangePasswordModal = ({ isOpen, teacher, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !teacher) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.trim().length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.patch(`/teachers/${teacher._id}/password`, { password: password.trim() });
      if (onSuccess) onSuccess('Teacher password updated successfully');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update teacher password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#141418] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-dark flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Reset Staff Password</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{teacher.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-bad-soft text-bad border border-bad/20 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              New Password (minimum 6 characters) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Updating...' : 'Set New Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
