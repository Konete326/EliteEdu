const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getTemplate, parseRows, executeImport } = require('../controllers/bulkImportController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/template/:entityType', getTemplate);
router.post('/parse', parseRows);
router.post('/execute', executeImport);

module.exports = router;
