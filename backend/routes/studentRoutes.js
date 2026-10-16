const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getStudents,
  getStudentById,
  getNextFamilyNumber,
  createStudent,
  updateStudent
} = require('../controllers/studentController');
const {
  toggleStudentStatus,
  deleteStudent
} = require('../controllers/studentActionController');
const { exportStudentCardsPdfHandler } = require('../controllers/studentPdfController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/export-cards-pdf', exportStudentCardsPdfHandler);
router.post('/export-cards-pdf', exportStudentCardsPdfHandler);
router.get('/next-family-number', getNextFamilyNumber);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.patch('/:id/status', toggleStudentStatus);
router.delete('/:id', deleteStudent);

module.exports = router;
