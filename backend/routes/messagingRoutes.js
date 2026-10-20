const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getDirectory } = require('../controllers/chatDirectoryController');
const { getConversations, createOrGetDirect, toggleFavorite } = require('../controllers/chatConversationController');
const { createGroup } = require('../controllers/chatGroupController');
const { getMessages, sendMessage, deleteMessage } = require('../controllers/chatMessageController');
const { handleCardAction } = require('../controllers/chatCardActionController');
const { handleSlashCommand } = require('../controllers/chatSlashCommandController');
const { togglePin, updateSettings, clearChat, deleteConversation } = require('../controllers/chatConversationSettingsController');
const { editMessage } = require('../controllers/chatMessageEditController');
const { submitFormPoll } = require('../controllers/chatFormSubmissionController');
const { uploadChatMedia } = require('../controllers/chatUploadController');
const { subscribeClient } = require('../utils/chatRealtimeHub');

const router = express.Router();

router.use(protect);

router.get('/stream', subscribeClient);
router.get('/directory', getDirectory);
router.get('/conversations', getConversations);
router.post('/upload', uploadChatMedia);
router.post('/conversations/direct', createOrGetDirect);
router.post('/conversations/group', createGroup);
router.patch('/conversations/:id/favorite', toggleFavorite);
router.patch('/conversations/:id/pin', togglePin);
router.patch('/conversations/:id/settings', updateSettings);
router.delete('/conversations/:id/messages', clearChat);
router.delete('/conversations/:id', deleteConversation);

router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.post('/conversations/:id/slash-command', handleSlashCommand);
router.post('/conversations/:conversationId/slash-command', handleSlashCommand);
router.put('/messages/:messageId', editMessage);
router.delete('/messages/:messageId', deleteMessage);
router.post('/messages/:messageId/card-action', handleCardAction);
router.post('/messages/:messageId/form-submit', submitFormPoll);

module.exports = router;
