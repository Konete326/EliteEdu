const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getTransfers, executeTransfer, deleteTransfer } = require('../controllers/campusTransferController');
const {
  getOperationsRecords,
  createOperationsRecord,
  updateOperationsRecord,
  updateOperationStatus,
  deleteOperationsRecord
} = require('../controllers/campusOperationsController');
const {
  getBehaviorRecords,
  saveBehaviorRecord,
  deleteBehaviorRecord
} = require('../controllers/behaviorController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/campus-transfer', getTransfers);
router.post('/campus-transfer', executeTransfer);
router.delete('/campus-transfer/:id', deleteTransfer);

router.get('/records', getOperationsRecords);
router.post('/records', createOperationsRecord);
router.put('/records/:id', updateOperationsRecord);
router.patch('/records/:id/status', updateOperationStatus);
router.delete('/records/:id', deleteOperationsRecord);

router.get('/', getOperationsRecords);
router.post('/', createOperationsRecord);
router.put('/:id', updateOperationsRecord);
router.patch('/:id/status', updateOperationStatus);
router.delete('/:id', deleteOperationsRecord);

router.get('/behavior', getBehaviorRecords);
router.post('/behavior', saveBehaviorRecord);
router.delete('/behavior/:id', deleteBehaviorRecord);

module.exports = router;
