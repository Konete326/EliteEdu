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

router.use(authMiddleware, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/', getCampuses);
router.post('/', createCampus);
router.put('/:id', updateCampus);
router.delete('/:id', deleteCampus);

module.exports = router;
