import { Shield, LayoutDashboard, Copy, Trash2, Edit2, Users } from 'lucide-react';
import usePermissions from '../../../hooks/usePermissions';

const UserRoleCard = ({ role, onDashboard, onCopy, onEdit, onDelete }) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('user_management');
  const activeModules = (role.permissions || []).filter(
    (p) => p.view || p.add || p.edit || p.delete || p.filter || p.reports
  ).length;

  return (
    <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex flex-col justify-between space-y-3 transition-all hover:border-primary/30">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-ink dark:text-ink-dark">{role.name}</h4>
              <span className="text-[10px] text-ink-muted">{role.campus_id?.name || 'Global / All Campuses'}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            {role.dashboard_type?.replace('Dashboard', '') || 'Teacher'} UI
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-2 line-clamp-2">
          {role.description || 'Dynamic tenant role with granular module permissions.'}
        </p>
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-line dark:border-line-dark text-[11px] text-ink-muted">
          <span><strong>{activeModules}</strong> Modules</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {role.user_count || 0} Users
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-line dark:border-line-dark">
        <button
          type="button"
          onClick={() => onDashboard(role)}
          title="Change Dashboard Layout"
          className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onCopy(role)}
          title="Copy to Campus"
          className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(role)}
          title="Edit Permissions"
          className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {!role.is_system && hasDelete && (
          <button
            type="button"
            onClick={() => onDelete(role)}
            title="Delete Role"
            className="p-1.5 rounded-lg hover:bg-bad/10 text-ink-muted hover:text-bad cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserRoleCard;
