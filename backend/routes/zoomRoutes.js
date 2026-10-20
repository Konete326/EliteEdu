const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { handleZoomWebhook } = require('../controllers/zoomWebhookController');
const { getZoomSettings, updateZoomSettings, testZoomConnection } = require('../controllers/zoomSettingsController');

const router = express.Router();

router.post('/webhook', handleZoomWebhook);
router.get('/settings', protect, getZoomSettings);
router.post('/settings', protect, updateZoomSettings);
router.post('/test-connection', protect, testZoomConnection);

module.exports = router;
