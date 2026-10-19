const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope, requireTeacherPermission } = require('../middlewares/tenantGuard');
const { getTeacherPortalMe, getTeacherStudents } = require('../controllers/teacherPortalController');
const { getTeacherStudentById, createTeacherStudent, updateTeacherStudent } = require('../controllers/teacherStudentController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/me', getTeacherPortalMe);
router.get('/my-students', requireTeacherPermission('students'), getTeacherStudents);
router.get('/students/:studentId', requireTeacherPermission('students'), getTeacherStudentById);
router.post('/students', requireTeacherPermission('students'), createTeacherStudent);
router.put('/students/:studentId', requireTeacherPermission('students'), updateTeacherStudent);

module.exports = router;
