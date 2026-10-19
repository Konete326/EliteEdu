const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getMigrationTemplate, parseAndValidateBatch } = require('../controllers/bulkMigrationParseController');
const { executeBatchCommit } = require('../controllers/bulkMigrationExecuteController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin'));

router.get('/template/:entity', getMigrationTemplate);
router.post('/parse', parseAndValidateBatch);
router.post('/execute', executeBatchCommit);

module.exports = router;
