const express = require('express');
const { registerSchool, getSchools } = require('../controllers/schoolController');
const { updateSchool, toggleSchoolStatus, deleteSchool } = require('../controllers/schoolManageController');
const { getSchoolTheme, updateSchoolTheme } = require('../controllers/schoolThemeController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/theme', authMiddleware, getSchoolTheme);
router.patch('/theme', authMiddleware, authorizeRoles('Admin'), updateSchoolTheme);
router.post('/', authMiddleware, authorizeRoles('SuperAdmin'), registerSchool);
router.get('/', authMiddleware, authorizeRoles('SuperAdmin'), getSchools);
router.put('/:id', authMiddleware, authorizeRoles('SuperAdmin'), updateSchool);
router.patch('/:id/status', authMiddleware, authorizeRoles('SuperAdmin'), toggleSchoolStatus);
router.delete('/:id', authMiddleware, authorizeRoles('SuperAdmin'), deleteSchool);

module.exports = router;
