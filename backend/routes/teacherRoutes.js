const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher
} = require('../controllers/teacherController');
const {
  toggleTeacherStatus,
  deleteTeacher,
  changeTeacherPassword
} = require('../controllers/teacherActionController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', addTeacher);
router.put('/:id', updateTeacher);
router.patch('/:id/status', toggleTeacherStatus);
router.patch('/:id/password', changeTeacherPassword);
router.delete('/:id', deleteTeacher);

module.exports = router;
