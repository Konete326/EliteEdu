const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getClassSheet,
  bulkSaveClassSheet,
  saveBehaviorRecord,
  getBehaviorRecords,
  deleteBehaviorRecord
} = require('../controllers/behaviorController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'Teacher', 'SuperAdmin'));

router.get('/class-sheet', getClassSheet);
router.post('/bulk-save', bulkSaveClassSheet);
router.post('/', saveBehaviorRecord);
router.get('/', getBehaviorRecords);
router.delete('/:id', deleteBehaviorRecord);

module.exports = router;
