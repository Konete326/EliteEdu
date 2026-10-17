import { Shield, Check, X, Building, User } from 'lucide-react';

const TeacherRoleScopeCard = ({ customRole, teacher }) => {
  const roleName = customRole?.name || teacher?.designation || 'Faculty Member';
  const campusName = teacher?.campus_id?.name || 'Main School Campus';
  const permissions = customRole?.permissions || [];

  const grantedModules = permissions.filter((p) => p.view);
  const canDeleteAny = permissions.some((p) => p.delete);
  const canAddAny = permissions.some((p) => p.add);
  const canEditAny = permissions.some((p) => p.edit);
  const canReportsAny = permissions.some((p) => p.reports);

  return (
    <div className="rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Role & Security Scope</h3>
            <p className="text-[10px] text-ink-muted">Access permissions allocated by administration</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-good/10 text-good border border-good/20">
          Active Scope
        </span>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface-secondary/40 dark:bg-[#141418] border border-line dark:border-line-dark space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-ink-muted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" /> Assigned Role
          </span>
          <span className="font-bold text-ink dark:text-ink-dark">{roleName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-ink-muted flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-primary" /> Campus Jurisdiction
          </span>
          <span className="font-semibold text-ink-muted">{campusName}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Granular Action Privileges</p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/30 dark:bg-[#141418] border border-line dark:border-line-dark">
            <span className="text-ink-muted">Create / Add</span>
            {canAddAny ? (
              <span className="text-good font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Yes</span>
            ) : (
              <span className="text-bad font-bold flex items-center gap-1"><X className="w-3 h-3" /> No</span>
            )}
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/30 dark:bg-[#141418] border border-line dark:border-line-dark">
            <span className="text-ink-muted">Modify / Edit</span>
            {canEditAny ? (
              <span className="text-good font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Yes</span>
            ) : (
              <span className="text-bad font-bold flex items-center gap-1"><X className="w-3 h-3" /> No</span>
            )}
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/30 dark:bg-[#141418] border border-line dark:border-line-dark">
            <span className="text-ink-muted">Delete Rights</span>
            {canDeleteAny ? (
              <span className="text-good font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Yes</span>
            ) : (
              <span className="text-bad font-bold flex items-center gap-1"><X className="w-3 h-3" /> Restricted</span>
            )}
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/30 dark:bg-[#141418] border border-line dark:border-line-dark">
            <span className="text-ink-muted">Financial Reports</span>
            {canReportsAny ? (
              <span className="text-good font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Yes</span>
            ) : (
              <span className="text-bad font-bold flex items-center gap-1"><X className="w-3 h-3" /> No</span>
            )}
          </div>
        </div>
      </div>

      {grantedModules.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Granted System Modules</p>
          <div className="flex flex-wrap gap-1.5">
            {grantedModules.map((m) => (
              <span
                key={m.module_key}
                className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold"
              >
                {m.module_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRoleScopeCard;
