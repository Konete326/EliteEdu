import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  const can = (moduleKey, action = 'view') => {
    if (isAdmin) return true;
    const customRole = user?.custom_role_id || user?.custom_role;
    if (!customRole || !customRole.permissions || !customRole.permissions.length) return true;

    const mod = customRole.permissions.find(
      (p) => p.module_key?.toLowerCase() === moduleKey?.toLowerCase()
    );
    if (!mod) return false;
    return Boolean(mod[action]);
  };

  const canDelete = (moduleKey) => can(moduleKey, 'delete');
  const canAdd = (moduleKey) => can(moduleKey, 'add');
  const canEdit = (moduleKey) => can(moduleKey, 'edit');
  const canView = (moduleKey) => can(moduleKey, 'view');
  const canReports = (moduleKey) => can(moduleKey, 'reports');

  return { isAdmin, can, canDelete, canAdd, canEdit, canView, canReports };
};

export default usePermissions;
