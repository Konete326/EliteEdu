const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getSubjects,
  createSubject,
  updateSubject
} = require('../controllers/subjectController');
const {
  bulkSeedSubjects,
  toggleSubjectField,
  deleteSubject
} = require('../controllers/subjectActionController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/', getSubjects);
router.post('/', createSubject);
router.post('/seed-defaults', bulkSeedSubjects);
router.put('/:id', updateSubject);
router.patch('/:id/toggle', toggleSubjectField);
router.delete('/:id', deleteSubject);

module.exports = router;
