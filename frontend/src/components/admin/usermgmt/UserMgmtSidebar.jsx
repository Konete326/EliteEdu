import { Shield, Building2, Plus } from 'lucide-react';
import UserInspectorCard from './UserInspectorCard';

const UserMgmtSidebar = ({
  selectedUser,
  onClearSelected,
  onEditUser,
  onResetPassword,
  onAssignCampus,
  onToggleStatus,
  onDeleteUser,
  roles = [],
  campuses = [],
  totalUsers = 0,
  onAddUser,
  onAddRole
}) => {
  if (selectedUser) {
    return (
      <UserInspectorCard
        user={selectedUser}
        onClear={onClearSelected}
        onEdit={onEditUser}
        onResetPassword={onResetPassword}
        onAssignCampus={onAssignCampus}
        onToggleStatus={onToggleStatus}
        onDelete={onDeleteUser}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 space-y-3 shadow-xs">
        <h4 className="text-xs font-semibold text-text dark:text-text-dark flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" /> Security & Access Summary
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-alt dark:bg-white/5 border border-line dark:border-white/5">
            <p className="text-[10px] text-text-muted">Total Accounts</p>
            <p className="text-base font-bold text-text dark:text-text-dark">{totalUsers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-alt dark:bg-white/5 border border-line dark:border-white/5">
            <p className="text-[10px] text-text-muted">Defined Roles</p>
            <p className="text-base font-bold text-primary">{roles.length}</p>
          </div>
        </div>
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-text dark:text-text-dark mb-1.5">Roles Catalog</p>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {roles.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/40 dark:bg-white/5 border border-line dark:border-white/5">
                <span className="font-medium text-text dark:text-text-dark truncate">{r.name}</span>
                <span className="text-[10px] text-text-muted shrink-0">{(r.permissions || []).length} modules</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 space-y-2 shadow-xs">
        <h4 className="text-xs font-semibold text-text dark:text-text-dark flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" /> Campuses ({campuses.length})
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {campuses.map((c) => (
            <div key={c._id} className="text-xs py-1 px-2 rounded-lg bg-white/40 dark:bg-white/5 flex items-center justify-between">
              <span className="text-text dark:text-text-dark truncate">{c.name}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{c.code || 'Active'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onAddUser} className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover flex items-center justify-center gap-1 shadow-xs">
          <Plus className="w-3.5 h-3.5" /> Add User
        </button>
        <button type="button" onClick={onAddRole} className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] text-text hover:border-primary flex items-center justify-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>
    </div>
  );
};

export default UserMgmtSidebar;
