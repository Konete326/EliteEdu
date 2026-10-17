const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getExams, getExamById, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { getPrerequisites } = require('../controllers/examPrerequisitesController');
const { getMarksSheet, saveMarksSheet } = require('../controllers/examMarksController');
const { getExamPrintData } = require('../controllers/examPrintController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/prerequisites', getPrerequisites);
router.get('/', getExams);
router.get('/:id/marks-sheet', getMarksSheet);
router.post('/:id/marks-sheet', saveMarksSheet);
router.get('/:id/print-data', getExamPrintData);
router.get('/:id', getExamById);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;
