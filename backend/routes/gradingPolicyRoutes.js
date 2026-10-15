const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getGradingPolicy,
  saveGradingScale,
  saveFailCriteria,
  resetDefaultScale
} = require('../controllers/gradingPolicyController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/', getGradingPolicy);
router.put('/scale', saveGradingScale);
router.put('/fail-criteria', saveFailCriteria);
router.post('/reset-defaults', resetDefaultScale);

module.exports = router;
