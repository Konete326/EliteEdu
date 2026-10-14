import { User } from 'lucide-react';

const AdminInfoForm = ({ admin, setAdmin, errors = {} }) => {
  const getFieldClass = (hasError) =>
    `w-full px-3 py-2 rounded-lg border bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-bad focus:ring-bad/20 focus:border-bad'
        : 'border-line dark:border-line-dark focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <div className="p-6 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark space-y-4 shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-ink dark:text-ink-dark border-b border-line dark:border-line-dark pb-3">
        <User className="w-5 h-5 text-primary" />
        <h2>Principal / Admin Credentials</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Admin Name *</label>
          <input required value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} className={getFieldClass(false)} placeholder="Full Name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Admin Email *</label>
          <input required type="email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} className={getFieldClass(errors.adminEmail)} placeholder="admin@school.edu" />
          {errors.adminEmail && <p className="text-bad text-xs mt-1">{errors.adminEmail}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Password *</label>
          <input required type="password" minLength={6} value={admin.password} onChange={(e) => setAdmin({ ...admin, password: e.target.value })} className={getFieldClass(errors.adminPassword)} placeholder="Min 6 characters" />
          {errors.adminPassword && <p className="text-bad text-xs mt-1">{errors.adminPassword}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminInfoForm;
