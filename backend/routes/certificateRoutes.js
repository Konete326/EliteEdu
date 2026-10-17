const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/certificateTemplateController');
const {
  getIssuedCertificates,
  generateCertificate,
  deleteIssuedCertificate
} = require('../controllers/certificateController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

router.get('/issued', getIssuedCertificates);
router.post('/generate', generateCertificate);
router.delete('/issued/:id', deleteIssuedCertificate);

module.exports = router;
