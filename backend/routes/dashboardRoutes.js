const express = require('express');
const { getSuperAdminStats, getAdminStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/superadmin', authMiddleware, authorizeRoles('SuperAdmin'), getSuperAdminStats);
router.get('/admin', authMiddleware, authorizeRoles('Admin'), getAdminStats);

module.exports = router;
