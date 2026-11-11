import { KeyRound, Lock, Clock, Info, ShieldCheck } from 'lucide-react';

const ProfileSecurityTab = () => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 max-w-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-dark flex items-center justify-center font-bold shrink-0 border border-primary/20">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">
              Password &amp; Security Management
            </h3>
            <p className="text-[11px] text-ink-muted">
              Portal authentication and credential security settings
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
          <Clock className="w-3 h-3" />
          <span>Coming Soon</span>
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-ink dark:text-white flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-200 text-[11px]">
            Administrative Password Change Locked
          </p>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Admin accounts cannot modify credentials directly from this tab right now. Password self-service and two-factor authentication (2FA) will be unlocked in the upcoming security update.
          </p>
        </div>
      </div>

      <div className="space-y-3 opacity-60 pointer-events-none select-none">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Current Password</span>
            <Lock className="w-3 h-3 text-ink-muted" />
          </label>
          <input
            type="password"
            disabled
            value="••••••••••••"
            readOnly
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141419] text-ink-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>New Password</span>
            <Lock className="w-3 h-3 text-ink-muted" />
          </label>
          <input
            type="password"
            disabled
            placeholder="Locked until next release"
            readOnly
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141419] text-ink-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Confirm New Password</span>
            <Lock className="w-3 h-3 text-ink-muted" />
          </label>
          <input
            type="password"
            disabled
            placeholder="Locked until next release"
            readOnly
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141419] text-ink-muted cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-secondary/70 dark:bg-[#16161a] border border-line dark:border-line-dark text-ink-muted text-xs font-bold shadow-2xs cursor-not-allowed"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Password Change Coming Soon</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-good" />
          <span>Account protected by SuperAdmin governance</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurityTab;
