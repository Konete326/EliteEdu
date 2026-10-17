const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getClassSummary,
  getStudentMonthlyMatrix,
  getStaffMonthlyMatrix
} = require('../controllers/attendanceReportController');

router.use(protect);
router.get('/class-summary', getClassSummary);
router.get('/student-monthly-matrix', getStudentMonthlyMatrix);
router.get('/staff-monthly-matrix', getStaffMonthlyMatrix);

module.exports = router;
