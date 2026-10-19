const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');

const {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure
} = require('../controllers/feeStructureController');

const {
  getChallanSettings,
  updateChallanSettings
} = require('../controllers/feeChallanSettingController');

const {
  getInvoices,
  getSingleInvoice,
  bulkUpdateDueDate,
  revertInvoice
} = require('../controllers/feeInvoiceController');

const { generateMonthlyChallans } = require('../controllers/feeInvoiceGeneratorController');
const { collectInvoiceFee, getFeeHistory } = require('../controllers/feeCollectionController');
const { getFeeDefaulters, sendDefaulterAlert } = require('../controllers/feeDefaulterController');
const { getFeeConcessions, updateStudentConcession } = require('../controllers/feeConcessionController');
const { getFeeReports } = require('../controllers/feeAnalyticsController');
const { getFeeSummary, getFeeStudents } = require('../controllers/feeSummaryController');
const { deleteFeePayment } = require('../controllers/feeDeleteController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin'));

router.get('/summary', getFeeSummary);
router.get('/students', getFeeStudents);
router.get('/history', getFeeHistory);
router.delete('/:id', deleteFeePayment);

router.get('/structures', getFeeStructures);
router.post('/structures', createFeeStructure);
router.put('/structures/:id', updateFeeStructure);
router.delete('/structures/:id', deleteFeeStructure);

router.get('/challan-settings', getChallanSettings);
router.put('/challan-settings', updateChallanSettings);

router.get('/invoices', getInvoices);
router.get('/invoices/:id', getSingleInvoice);
router.post('/invoices/generate', generateMonthlyChallans);
router.post('/invoices/bulk-update-due-date', bulkUpdateDueDate);
router.post('/invoices/:id/revert', revertInvoice);
router.post('/invoices/:id/collect', collectInvoiceFee);

router.get('/defaulters', getFeeDefaulters);
router.post('/defaulters/alert', sendDefaulterAlert);

router.get('/concessions', getFeeConcessions);
router.patch('/concessions/:studentId', updateStudentConcession);

router.get('/reports', getFeeReports);

module.exports = router;
