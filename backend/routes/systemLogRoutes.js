const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const controller = require('../controllers/systemLogController');

const router = express.Router();

router.post('/telemetry', controller.ingestTelemetry);
router.get('/', authMiddleware, authorizeRoles('SuperAdmin', 'Admin'), controller.getSystemLogs);
router.delete('/:id', authMiddleware, authorizeRoles('SuperAdmin'), controller.deleteSingleLog);
router.delete('/', authMiddleware, authorizeRoles('SuperAdmin'), controller.clearLogs);

module.exports = router;
