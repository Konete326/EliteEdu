import { useState } from 'react';
import { MoreHorizontal, Edit2, Key, Building2, Trash2, Power } from 'lucide-react';
import usePermissions from '../../../hooks/usePermissions';

const UsersTable = ({ users, selectedUser, onSelectUser, onEdit, onToggleStatus, onResetPassword, onAssignCampus, onDelete }) => {
  const { canDelete } = usePermissions();
  const hasDelete = canDelete('user_management');
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/40 text-ink-muted font-semibold">
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Role / Custom Role</th>
            <th className="py-3 px-4">Campus(es)</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {users.map((u) => {
            const isMenuOpen = activeMenuId === u._id;
            const isSelected = selectedUser?._id === u._id;
            return (
              <tr
                key={u._id}
                onClick={() => onSelectUser && onSelectUser(isSelected ? null : u)}
                className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-surface-secondary/20'}`}
              >
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-ink dark:text-ink-dark">{u.name}</div>
                      <div className="text-[11px] text-ink-muted">{u.email || 'No email registered'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-surface-secondary border border-line text-ink">
                      {u.role}
                    </span>
                    {u.custom_role_id && (
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-primary/10 text-primary border border-primary/20">
                        {u.custom_role_id.name || 'Custom'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-ink dark:text-ink-dark font-medium">{u.campus_id?.name || 'Main Campus'}</div>
                  {u.assigned_campuses?.length > 1 && (
                    <div className="text-[10px] text-ink-muted">+{u.assigned_campuses.length - 1} more</div>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-ink-muted">{u.contact_number || '—'}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(u); }}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer border transition-colors ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-bad/10 text-bad border-bad/20'}`}
                  >
                    {u.status === 'Active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-right relative">
                  <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : u._id)}
                      className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-ink cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-4 top-10 z-30 w-44 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl shadow-lg py-1 text-left text-xs space-y-0.5">
                        <button type="button" onClick={() => { setActiveMenuId(null); onEdit(u); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-secondary text-ink cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" /> Edit User
                        </button>
                        <button type="button" onClick={() => { setActiveMenuId(null); onToggleStatus(u); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-secondary text-ink cursor-pointer">
                          <Power className="w-3.5 h-3.5" /> {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button type="button" onClick={() => { setActiveMenuId(null); onResetPassword(u); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-secondary text-ink cursor-pointer">
                          <Key className="w-3.5 h-3.5" /> Reset Password
                        </button>
                        <button type="button" onClick={() => { setActiveMenuId(null); onAssignCampus(u); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-secondary text-ink cursor-pointer">
                          <Building2 className="w-3.5 h-3.5" /> Assign Campus
                        </button>
                        {hasDelete && (
                          <>
                            <div className="border-t border-line dark:border-line-dark my-1" />
                            <button type="button" onClick={() => { setActiveMenuId(null); onDelete(u); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-bad/10 text-bad cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
