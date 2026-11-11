import { Edit2, Key, Building2, Trash2, Power, Phone, Shield } from 'lucide-react';

const UserMobileCard = ({
  user: u,
  isSelected,
  onSelectUser,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onAssignCampus,
  onDelete,
  hasDelete
}) => {
  const isActive = u.status === 'Active';

  return (
    <div
      onClick={() => onSelectUser && onSelectUser(isSelected ? null : u)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 shadow-2xs ${
        isSelected
          ? 'bg-primary/5 border-primary ring-1 ring-primary/30'
          : 'bg-surface dark:bg-surface-dark border border-line dark:border-line-dark'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20">
            {u.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-ink dark:text-white truncate">{u.name}</h4>
            <p className="text-[11px] text-ink-muted truncate">{u.email || 'No email registered'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(u);
          }}
          className={`min-h-[38px] px-3.5 py-1 flex items-center justify-center rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-bad/10 text-bad border-bad/20'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-surface-secondary border border-line text-ink dark:text-white">
          {u.role}
        </span>
        {u.custom_role_id && (
          <span className="px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-primary/10 text-primary border border-primary/20">
            {u.custom_role_id.name || 'Custom'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-secondary/40 p-2.5 rounded-xl">
        <div className="truncate">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Campus</span>
          <span className="font-semibold text-ink dark:text-white truncate block">
            {u.campus_id?.name || 'Main Campus'}
            {u.assigned_campuses?.length > 1 ? ` (+${u.assigned_campuses.length - 1})` : ''}
          </span>
        </div>
        <div className="truncate">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Phone</span>
          <span className="font-semibold text-ink dark:text-white truncate block font-mono">
            {u.contact_number || '—'}
          </span>
        </div>
      </div>

      <div
        className="flex items-center justify-end gap-1 pt-2 border-t border-line/60 dark:border-line-dark/60 flex-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onEdit(u)}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Edit User"
        >
          <Edit2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => onResetPassword(u)}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Reset Password"
        >
          <Key size={15} />
        </button>
        <button
          type="button"
          onClick={() => onAssignCampus(u)}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Assign Campus"
        >
          <Building2 size={15} />
        </button>
        {hasDelete && (
          <button
            type="button"
            onClick={() => onDelete(u)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserMobileCard;

