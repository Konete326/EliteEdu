import { useState } from 'react';
import { X, KeyRound, Eye, EyeOff } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const UserPasswordModal = ({ user, token, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiBase()}/user-management/users/${user._id}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      onSuccess(data.message);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Reset Password</h3>
              <p className="text-[11px] text-ink-muted">{user?.name} ({user?.email})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleReset} autoComplete="off" className="p-6 space-y-4 text-xs">
          <input type="text" name="fake_username_autofill" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
          <input type="password" name="fake_password_autofill" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad text-xs font-medium">{error}</div>}
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">New Secure Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="new_admin_reset_password"
                id="new_admin_reset_password"
                required
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full px-3 py-2 pr-9 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-ink-muted mt-1.5">Resetting password will automatically revoke all user sessions.</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPasswordModal;
