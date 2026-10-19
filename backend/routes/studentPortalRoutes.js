const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getStudentPortalOverview,
  submitStudentHomework
} = require('../controllers/studentPortalController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Student', 'Admin', 'Teacher'));

router.get('/overview', getStudentPortalOverview);
router.post('/submit-homework/:lmsId', submitStudentHomework);

module.exports = router;
