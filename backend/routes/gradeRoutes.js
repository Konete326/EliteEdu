const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade
} = require('../controllers/gradeController');
const { bulkSeedGrades, toggleGradeStatus, reorderGrades } = require('../controllers/gradeActionController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('Admin', 'SuperAdmin', 'Teacher', 'Student'), getGrades);
router.post('/', authorizeRoles('Admin'), createGrade);
router.post('/seed-defaults', authorizeRoles('Admin'), bulkSeedGrades);
router.patch('/reorder', authorizeRoles('Admin'), reorderGrades);
router.put('/:id', authorizeRoles('Admin'), updateGrade);
router.patch('/:id/status', authorizeRoles('Admin'), toggleGradeStatus);
router.delete('/:id', authorizeRoles('Admin'), deleteGrade);

module.exports = router;
