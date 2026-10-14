const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent
} = require('../controllers/studentController');
const {
  toggleStudentStatus,
  deleteStudent
} = require('../controllers/studentActionController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.patch('/:id/status', toggleStudentStatus);
router.delete('/:id', deleteStudent);

module.exports = router;
