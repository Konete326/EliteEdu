const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const controller = require('../controllers/signatureController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/', controller.getSignatures);
router.post('/', controller.createSignature);
router.patch('/:id/default', controller.setDefaultSignature);
router.delete('/:id', controller.deleteSignature);

module.exports = router;
