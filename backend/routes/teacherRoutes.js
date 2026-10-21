const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher
} = require('../controllers/teacherController');
const {
  toggleTeacherStatus,
  deleteTeacher,
  changeTeacherPassword
} = require('../controllers/teacherActionController');
const { exportTeacherCardsPdfHandler } = require('../controllers/teacherPdfController');
const { uploadTeacherDocument, deleteTeacherDocument } = require('../controllers/teacherDocumentController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/export-cards-pdf', exportTeacherCardsPdfHandler);
router.post('/export-cards-pdf', exportTeacherCardsPdfHandler);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', addTeacher);
router.put('/:id', updateTeacher);
router.patch('/:id/status', toggleTeacherStatus);
router.patch('/:id/password', changeTeacherPassword);
router.delete('/:id', deleteTeacher);
router.post('/:id/documents', uploadTeacherDocument);
router.delete('/:id/documents/:docId', deleteTeacherDocument);

module.exports = router;
