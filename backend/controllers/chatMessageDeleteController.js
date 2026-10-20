const ChatMessage = require('../models/ChatMessage');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const msg = await ChatMessage.findOne({ _id: messageId, school_id: req.user.school_id });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (String(msg.sender_id) !== String(userId) && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this message' });
    }

    await ChatMessage.deleteOne({ _id: messageId });
    emitChatEvent(req.user.school_id, '*', 'message_deleted', { message_id: messageId });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message', error: error.message });
  }
};

module.exports = { deleteMessage };
