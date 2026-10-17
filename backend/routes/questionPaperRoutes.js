const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getChapters, createChapter, updateChapter, deleteChapter, seedDefaultChapters } = require('../controllers/questionChapterController');
const { getQuestions, createQuestion, updateQuestion, deleteQuestion, seedSampleQuestions } = require('../controllers/questionBankController');
const { getPapers, getPaperById, createPaper, updatePaper, deletePaper, autoGeneratePaper } = require('../controllers/questionPaperController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/chapters', getChapters);
router.post('/chapters', createChapter);
router.post('/chapters/seed', seedDefaultChapters);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.post('/questions/seed', seedSampleQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/papers', getPapers);
router.post('/papers', createPaper);
router.post('/papers/auto-generate', autoGeneratePaper);
router.get('/papers/:id', getPaperById);
router.put('/papers/:id', updatePaper);
router.delete('/papers/:id', deletePaper);

module.exports = router;
