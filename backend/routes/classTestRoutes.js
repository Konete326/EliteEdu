const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getClassTests, getClassTestById, createClassTest, updateClassTest, deleteClassTest } = require('../controllers/classTestController');
const { getClassTestSheet, saveClassTestMarks } = require('../controllers/classTestMarksController');
const { getClassTestPrerequisites } = require('../controllers/classTestPrereqsController');
const { getAnalytics } = require('../controllers/classTestAnalyticsController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/prerequisites', getClassTestPrerequisites);
router.get('/analytics', getAnalytics);
router.get('/', getClassTests);
router.post('/', createClassTest);
router.get('/:id/sheet', getClassTestSheet);
router.post('/:id/marks', saveClassTestMarks);
router.get('/:id', getClassTestById);
router.put('/:id', updateClassTest);
router.delete('/:id', deleteClassTest);

module.exports = router;
