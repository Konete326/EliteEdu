import { Key, Building2, UserX, X } from 'lucide-react';

const UserInspectorCard = ({
  user,
  onClear,
  onEdit,
  onResetPassword,
  onAssignCampus,
  onToggleStatus,
  onDelete
}) => {
  const isAct = user.status === 'Active';

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <span className="text-xs font-semibold text-text dark:text-text-dark">User Inspector</span>
        <button type="button" onClick={onClear} className="p-1 text-text-muted hover:text-text rounded-lg border border-line dark:border-white/10">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto border-2 border-primary/20">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text dark:text-text-dark">{user.name}</h4>
          <p className="text-xs text-text-muted">{user.email || 'No email'}</p>
        </div>
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
            {user.role}
          </span>
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${isAct ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
            {user.status}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs border-t border-line dark:border-white/10 pt-3">
        <div className="flex justify-between py-1 border-b border-line dark:border-white/5">
          <span className="text-text-muted">Campus</span>
          <span className="font-semibold text-text dark:text-text-dark">{user.campus_id?.name || 'Main Campus'}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-line dark:border-white/5">
          <span className="text-text-muted">Contact</span>
          <span className="font-semibold text-text dark:text-text-dark">{user.contact_number || '—'}</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-line dark:border-white/10">
        <button type="button" onClick={() => onEdit(user)} className="w-full py-1.5 px-3 text-xs font-medium rounded-xl border border-line dark:border-white/10 hover:border-primary text-text dark:text-text-dark flex items-center justify-center gap-1.5">
          Edit Details
        </button>
        <button type="button" onClick={() => onResetPassword(user)} className="w-full py-1.5 px-3 text-xs font-medium rounded-xl border border-line dark:border-white/10 hover:border-amber-500 text-text dark:text-text-dark flex items-center justify-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-amber-500" /> Reset Password
        </button>
        <button type="button" onClick={() => onAssignCampus(user)} className="w-full py-1.5 px-3 text-xs font-medium rounded-xl border border-line dark:border-white/10 hover:border-blue-500 text-text dark:text-text-dark flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-blue-500" /> Manage Campuses
        </button>
        <button type="button" onClick={() => onToggleStatus(user)} className="w-full py-1.5 px-3 text-xs font-medium rounded-xl border border-line dark:border-white/10 text-text hover:text-amber-600 flex items-center justify-center gap-1.5">
          {isAct ? 'Deactivate User' : 'Activate User'}
        </button>
        <button type="button" onClick={() => onDelete(user)} className="w-full py-1.5 px-3 text-xs font-medium rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center gap-1.5">
          <UserX className="w-3.5 h-3.5" /> Delete User
        </button>
      </div>
    </div>
  );
};

export default UserInspectorCard;
