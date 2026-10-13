const express = require('express');
const { registerSchool, getSchools } = require('../controllers/schoolController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('SuperAdmin'), registerSchool);
router.get('/', authMiddleware, authorizeRoles('SuperAdmin'), getSchools);

module.exports = router;
