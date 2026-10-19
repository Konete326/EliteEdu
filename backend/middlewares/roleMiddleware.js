const UserRole = require('../models/UserRole');

const ROUTE_MODULE_MAP = {
  students: 'students',
  teachers: 'teachers',
  fees: 'fees',
  grades: 'grades',
  subjects: 'subjects',
  campus: 'campus',
  exams: 'exams',
  'exam-suite': 'exams',
  'question-papers': 'exams',
  classtests: 'exams',
  'class-tests': 'exams',
  attendance: 'attendance',
  'user-management': 'user_management',
  reports: 'reports',
  system: 'control_panel',
  settings: 'control_panel'
};

const getActionFromMethod = (method) => {
  if (method === 'GET') return 'view';
  if (method === 'POST') return 'add';
  if (method === 'PUT' || method === 'PATCH') return 'edit';
  if (method === 'DELETE') return 'delete';
  return 'view';
};

const getModuleFromUrl = (url = '') => {
  const segment = url.split('/').filter(Boolean)[1] || '';
  return ROUTE_MODULE_MAP[segment.toLowerCase()] || segment.toLowerCase();
};

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = (req.user.role || '').trim().toLowerCase();
    if (userRole === 'superadmin' || userRole === 'admin') return next();

    const targetModule = getModuleFromUrl(req.baseUrl || req.originalUrl || '');
    const requiredAction = getActionFromMethod(req.method);

    if (req.user.custom_role_id) {
      try {
        const customRole = typeof req.user.custom_role_id === 'object' && req.user.custom_role_id.permissions
          ? req.user.custom_role_id
          : await UserRole.findById(req.user.custom_role_id).lean();

        if (customRole && customRole.status === 'Active') {
          req.user.customRole = customRole;
          const perms = customRole.permissions || [];
          const modPerm = perms.find((p) => p.module_key?.toLowerCase() === targetModule);
          if (modPerm) {
            if (!modPerm[requiredAction]) {
              return res.status(403).json({ message: `${requiredAction.toUpperCase()} permission denied for module: ${targetModule}` });
            }
            return next();
          }
          if (roles.some((r) => r.toLowerCase() === userRole)) return next();
          return res.status(403).json({ message: `Access denied for module: ${targetModule}` });
        }
      } catch {}
    }

    if (roles.some((r) => r.toLowerCase() === userRole)) return next();

    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  };
};

module.exports = authorizeRoles;
