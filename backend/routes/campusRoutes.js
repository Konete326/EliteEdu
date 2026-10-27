const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getCampuses,
  createCampus,
  updateCampus,
  deleteCampus
} = require('../controllers/campusController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('Admin', 'SuperAdmin', 'Teacher'), getCampuses);
router.post('/', authorizeRoles('Admin', 'SuperAdmin'), createCampus);
router.put('/:id', authorizeRoles('Admin', 'SuperAdmin'), updateCampus);
router.delete('/:id', authorizeRoles('Admin', 'SuperAdmin'), deleteCampus);

module.exports = router;
