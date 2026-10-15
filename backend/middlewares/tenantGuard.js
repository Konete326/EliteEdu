const User = require('../models/User');

const enforceTenantScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role === 'SuperAdmin') {
    req.schoolId = req.query.school_id || req.body.school_id || req.user.school_id || null;
    return next();
  }

  if (!req.user.school_id) {
    return res.status(403).json({ success: false, message: 'Unauthorized school scope' });
  }

  req.schoolId = req.user.school_id;
  if (req.body && typeof req.body === 'object') {
    req.body.school_id = req.user.school_id;
  }
  if (req.query && typeof req.query === 'object') {
    req.query.school_id = req.user.school_id;
  }

  next();
};

const requireTeacherPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      if (req.user.role === 'SuperAdmin' || req.user.role === 'Admin') {
        return next();
      }

      if (req.user.role !== 'Teacher') {
        return res.status(403).json({ success: false, message: 'Access restricted to teachers' });
      }

      const teacher = await User.findOne({
        _id: req.user.id,
        school_id: req.user.school_id
      }).select('status is_active app_settings app_permissions');

      if (!teacher || teacher.status === 'Inactive' || teacher.is_active === false) {
        return res.status(403).json({ success: false, message: 'Teacher account is inactive' });
      }

      const permissions = teacher.app_settings || teacher.app_permissions || {};
      if (permissionKey && permissions[permissionKey] === false) {
        return res.status(403).json({
          success: false,
          message: `Access denied for module: ${permissionKey}`
        });
      }

      req.teacherPermissions = permissions;
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Permission verification failed' });
    }
  };
};

module.exports = { enforceTenantScope, requireTeacherPermission };
