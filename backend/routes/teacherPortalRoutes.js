const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope, requireTeacherPermission } = require('../middlewares/tenantGuard');
const { getTeacherPortalMe, getTeacherStudents } = require('../controllers/teacherPortalController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/me', getTeacherPortalMe);
router.get('/my-students', requireTeacherPermission('students'), getTeacherStudents);

module.exports = router;
