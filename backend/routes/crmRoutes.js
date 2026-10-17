const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getLeads, getLeadById } = require('../controllers/crmLeadQueryController');
const { createLead, updateLead, deleteLead, togglePin, updateStage, addFollowUp } = require('../controllers/crmLeadActionController');
const { convertLeadToStudent } = require('../controllers/crmConversionController');
const { getAnalytics } = require('../controllers/crmAnalyticsController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/leads', getLeads);
router.post('/leads', createLead);
router.get('/leads/:id', getLeadById);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);
router.patch('/leads/:id/pin', togglePin);
router.patch('/leads/:id/stage', updateStage);
router.post('/leads/:id/follow-up', addFollowUp);
router.post('/leads/:id/convert', convertLeadToStudent);
router.get('/analytics', getAnalytics);

module.exports = router;
