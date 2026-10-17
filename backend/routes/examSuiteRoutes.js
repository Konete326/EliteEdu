const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/examCategoryController');
const { getRemarkPolicies, saveRemarkPolicies, deleteRemarkPolicy } = require('../controllers/remarkPolicyController');
const { getRemarkTemplates, createRemarkTemplate, updateRemarkTemplate, deleteRemarkTemplate } = require('../controllers/remarkTemplateController');
const { getDatesheets, getDatesheetById, createDatesheet, updateDatesheet, deleteDatesheet } = require('../controllers/datesheetController');
const { generateSeatingArrangement } = require('../controllers/seatingPlanController');
const { getMarkSheets, getMarkSheetById, createMarkSheet, saveMarks, toggleLock, deleteMarkSheet } = require('../controllers/markSheetController');
const { getAttendanceSummary, getClassResultsGazette } = require('../controllers/markSheetResultsController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/remarks-policy', getRemarkPolicies);
router.post('/remarks-policy', saveRemarkPolicies);
router.delete('/remarks-policy/:id', deleteRemarkPolicy);

router.get('/manage-remarks', getRemarkTemplates);
router.post('/manage-remarks', createRemarkTemplate);
router.put('/manage-remarks/:id', updateRemarkTemplate);
router.delete('/manage-remarks/:id', deleteRemarkTemplate);

router.get('/datesheets', getDatesheets);
router.post('/datesheets', createDatesheet);
router.post('/datesheets/seating-arrangement', generateSeatingArrangement);
router.get('/datesheets/:id', getDatesheetById);
router.put('/datesheets/:id', updateDatesheet);
router.delete('/datesheets/:id', deleteDatesheet);

router.get('/mark-sheets', getMarkSheets);
router.post('/mark-sheets', createMarkSheet);
router.get('/mark-sheets/attendance', getAttendanceSummary);
router.get('/mark-sheets/class-results', getClassResultsGazette);
router.get('/mark-sheets/:id', getMarkSheetById);
router.post('/mark-sheets/:id/marks', saveMarks);
router.put('/mark-sheets/:id/lock', toggleLock);
router.delete('/mark-sheets/:id', deleteMarkSheet);

module.exports = router;
