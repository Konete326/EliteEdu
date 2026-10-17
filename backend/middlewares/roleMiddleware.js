const UserRole = require('../models/UserRole');

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role === 'SuperAdmin') return next();
    if (roles.includes(req.user.role) && req.user.role === 'Admin') return next();

    if (req.user.custom_role_id) {
      try {
        const customRole = typeof req.user.custom_role_id === 'object' && req.user.custom_role_id.permissions
          ? req.user.custom_role_id
          : await UserRole.findById(req.user.custom_role_id).lean();

        if (customRole && customRole.status === 'Active') {
          req.user.customRole = customRole;
          if (req.method === 'DELETE') {
            const hasDelete = (customRole.permissions || []).some((p) => p.delete === true);
            if (!hasDelete) {
              return res.status(403).json({ message: 'Delete permission not granted for this role' });
            }
          }
          return next();
        }
      } catch {}
    }

    if (roles.includes(req.user.role)) return next();

    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  };
};

module.exports = authorizeRoles;
