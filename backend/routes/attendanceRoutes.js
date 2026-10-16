const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const attendance = require('../controllers/attendanceController');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles('Admin', 'SuperAdmin', 'Teacher'));

router.get('/allowed-classes', attendance.getAllowedClasses);
router.get('/sheet', attendance.getAttendanceSheet);
router.post('/mark-bulk', attendance.markBulkAttendance);
router.post('/scan-card', attendance.scanCard);

module.exports = router;
