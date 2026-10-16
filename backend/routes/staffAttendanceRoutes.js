const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const staffAttendance = require('../controllers/staffAttendanceController');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

const router = express.Router();
router.use(authMiddleware);

const checkStaffAttendanceManageAccess = async (req, res, next) => {
  if (['Admin', 'SuperAdmin'].includes(req.user.role)) return next();
  if (req.user.role === 'Teacher') {
    const user = await User.findById(req.user.id || req.user._id).select('custom_role_id').lean();
    if (user?.custom_role_id) {
      const role = await UserRole.findById(user.custom_role_id).lean();
      const hasPerm = role?.permissions?.some(
        (p) => ['staff_attendance', 'attendance', 'employees'].includes(p.module_key) && (p.view || p.edit || p.add)
      );
      if (hasPerm) return next();
    }
  }
  return res.status(403).json({ message: 'Access denied: insufficient permissions to manage employee attendance' });
};

router.get('/my-history', staffAttendance.getMyHistory);
router.get('/sheet', checkStaffAttendanceManageAccess, staffAttendance.getStaffSheet);
router.post('/mark-bulk', checkStaffAttendanceManageAccess, staffAttendance.markBulkStaff);
router.post('/scan-card', checkStaffAttendanceManageAccess, staffAttendance.scanStaffCard);

module.exports = router;
