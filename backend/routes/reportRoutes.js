const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getStudentMaster } = require('../controllers/reportsController');
const { getStudentAdmissionInfo } = require('../controllers/studentAdmissionReportController');
const { getParentContactInfo } = require('../controllers/parentContactReportController');
const { getStudentReportCard } = require('../controllers/reportCardController');
const { getCategoryData } = require('../controllers/reportCategoryController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin', 'Teacher', 'SuperAdmin'));

router.get('/student-master', getStudentMaster);
router.get('/student-admission-info', getStudentAdmissionInfo);
router.get('/parent-contact-info', getParentContactInfo);
router.get('/student-report-card/:studentId', getStudentReportCard);
router.get('/category-data', getCategoryData);

module.exports = router;
