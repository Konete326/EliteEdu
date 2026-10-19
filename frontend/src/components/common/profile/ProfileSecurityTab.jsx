import { useState } from 'react';
import { KeyRound, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const ProfileSecurityTab = ({ onPasswordChange, saving }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!currentPassword) return setLocalError('Current password is required.');
    if (!newPassword || newPassword.length < 6) return setLocalError('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setLocalError('New password and confirmation do not match.');
    onPasswordChange(currentPassword, newPassword, () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-4 max-w-xl">
      <div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <span>Security & Password Management</span>
        </h3>
        <p className="text-[11px] text-ink-muted">Update your portal authentication credentials securely.</p>
      </div>

      {localError && (
        <div className="p-3 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Current Password <span className="text-bad">*</span>
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>New Password (min 6 characters) <span className="text-bad">*</span></span>
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-[10px] text-primary lowercase flex items-center gap-1 cursor-pointer">
              {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPass ? 'hide' : 'show'}</span>
            </button>
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Confirm New Password <span className="text-bad">*</span>
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type new password"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSecurityTab;
