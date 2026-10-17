const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { collectFee, getFeeHistory } = require('../controllers/feeCollectionController');
const { deleteFeePayment } = require('../controllers/feeDeleteController');
const { getFeeSummary, getFeeStudents } = require('../controllers/feeSummaryController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin'));

router.get('/summary', getFeeSummary);
router.get('/students', getFeeStudents);
router.get('/history', getFeeHistory);
router.post('/collect', collectFee);
router.delete('/:id', deleteFeePayment);

module.exports = router;
