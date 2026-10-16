const express = require('express');
const { registerSchool, getSchools } = require('../controllers/schoolController');
const { updateSchool, toggleSchoolStatus, deleteSchool } = require('../controllers/schoolManageController');
const { getSchoolTheme, updateSchoolTheme } = require('../controllers/schoolThemeController');
const { getSchoolGeneralSettings, updateSchoolGeneralSettings } = require('../controllers/schoolSettingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/general-settings', authMiddleware, getSchoolGeneralSettings);
router.put('/general-settings', authMiddleware, authorizeRoles('Admin', 'SuperAdmin'), updateSchoolGeneralSettings);
router.get('/theme', authMiddleware, getSchoolTheme);
router.patch('/theme', authMiddleware, authorizeRoles('Admin'), updateSchoolTheme);
router.post('/', authMiddleware, authorizeRoles('SuperAdmin'), registerSchool);
router.get('/', authMiddleware, authorizeRoles('SuperAdmin'), getSchools);
router.put('/:id', authMiddleware, authorizeRoles('SuperAdmin'), updateSchool);
router.patch('/:id/status', authMiddleware, authorizeRoles('SuperAdmin'), toggleSchoolStatus);
router.delete('/:id', authMiddleware, authorizeRoles('SuperAdmin'), deleteSchool);

module.exports = router;
