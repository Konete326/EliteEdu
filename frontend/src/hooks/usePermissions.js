import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isAdmin = user?.role === 'Admin';

  const can = (moduleKey, action = 'view') => {
    if (isSuperAdmin) return true;

    const customRole = user?.custom_role_id || user?.custom_role;
    const permissions = user?.permissions || customRole?.permissions;

    if (Array.isArray(permissions) && permissions.length > 0) {
      const mod = permissions.find(
        (p) => p.module_key?.toLowerCase() === moduleKey?.toLowerCase()
      );
      if (!mod) return false;
      return Boolean(mod[action]);
    }

    if (isAdmin) return true;
    if (action === 'delete') return false;
    return true;
  };

  const canDelete = (moduleKey) => can(moduleKey, 'delete');
  const canAdd = (moduleKey) => can(moduleKey, 'add');
  const canEdit = (moduleKey) => can(moduleKey, 'edit');
  const canView = (moduleKey) => can(moduleKey, 'view');
  const canReports = (moduleKey) => can(moduleKey, 'reports');

  return { isSuperAdmin, isAdmin, can, canDelete, canAdd, canEdit, canView, canReports };
};

export default usePermissions;
