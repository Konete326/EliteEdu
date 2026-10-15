import { Mail, Phone, ShieldCheck } from 'lucide-react';

const AccountDetailsForm = ({
  name,
  onNameChange,
  email,
  contactNumber,
  onContactNumberChange,
  role,
  submitting,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Full Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your full name"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141418] text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="email"
            disabled
            value={email || ''}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-black/30 text-ink-muted outline-none cursor-not-allowed font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Phone</label>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => onContactNumberChange(e.target.value)}
            placeholder="+923001234567"
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141418] text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Role</label>
        <div className="relative">
          <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            disabled
            value={role || ''}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-black/30 text-ink-muted outline-none cursor-not-allowed font-medium capitalize"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
      >
        {submitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default AccountDetailsForm;
