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

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/', getGrades);
router.post('/', createGrade);
router.post('/seed-defaults', bulkSeedGrades);
router.patch('/reorder', reorderGrades);
router.put('/:id', updateGrade);
router.patch('/:id/status', toggleGradeStatus);
router.delete('/:id', deleteGrade);

module.exports = router;
