const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const { getNotifications, createNotification } = require('../controllers/notificationController');
const { markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationActionsController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/', getNotifications);
router.post('/', authorizeRoles('Admin', 'SuperAdmin'), createNotification);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', authorizeRoles('Admin', 'SuperAdmin'), deleteNotification);

module.exports = router;
