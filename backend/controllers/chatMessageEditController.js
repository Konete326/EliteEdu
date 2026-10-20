const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;
    const input = req.body.message_text ?? req.body.text ?? '';

    let cleanText = String(input || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    if (!cleanText) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }
    if (cleanText.length > 4096) cleanText = cleanText.slice(0, 4096);

    const msg = await ChatMessage.findOne({ _id: messageId, school_id: schoolId });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (String(msg.sender_id) !== String(userId) && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this message' });
    }

    msg.message_text = cleanText;
    msg.is_edited = true;
    msg.edited_at = new Date();
    await msg.save();

    const conv = await ChatConversation.findById(msg.conversation_id);
    if (conv && String(conv.last_message_at?.getTime()) === String(msg.createdAt?.getTime())) {
      conv.last_message_text = cleanText;
      await conv.save();
    }

    const uids = conv ? conv.participants.map((p) => p.user_id) : '*';
    emitChatEvent(schoolId, uids, 'message_edited', { message: msg });

    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to edit message', error: error.message });
  }
};

module.exports = { editMessage };
