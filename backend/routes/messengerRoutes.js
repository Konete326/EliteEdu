const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getMessages,
  sendMessage,
  togglePin,
  getStaffDirectory,
  getUnreadSummary,
  markAsRead
} = require('../controllers/internalMessengerController');

const router = express.Router();

router.use(protect);

router.get('/messages', getMessages);
router.post('/messages', sendMessage);
router.put('/messages/:id/pin', togglePin);
router.put('/messages/read', markAsRead);
router.get('/directory', getStaffDirectory);
router.get('/unread-count', getUnreadSummary);

module.exports = router;
