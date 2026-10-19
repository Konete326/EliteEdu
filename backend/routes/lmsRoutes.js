const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');

const { getLmsItems, getSingleLmsItem } = require('../controllers/lmsQueryController');
const { createLmsItem, updateLmsItem, deleteLmsItem } = require('../controllers/lmsMutationController');
const { getItemSubmissions, updateItemSubmissions } = require('../controllers/lmsSubmissionsController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'Teacher'));

router.get('/', getLmsItems);
router.get('/:id', getSingleLmsItem);
router.post('/', createLmsItem);
router.put('/:id', updateLmsItem);
router.delete('/:id', deleteLmsItem);

router.get('/:id/submissions', getItemSubmissions);
router.post('/:id/submissions', updateItemSubmissions);

module.exports = router;
