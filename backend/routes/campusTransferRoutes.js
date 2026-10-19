const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getTransfers, executeTransfer, deleteTransfer } = require('../controllers/campusTransferController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/', getTransfers);
router.post('/', executeTransfer);
router.delete('/:id', deleteTransfer);

module.exports = router;
