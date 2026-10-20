const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const UserSession = require('../models/UserSession');
const { emitChatEvent } = require('../utils/chatRealtimeHub');
const { sendMessage } = require('./chatMessageSendController');
const { deleteMessage } = require('./chatMessageDeleteController');

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;

    const conv = await ChatConversation.findOne({ _id: id, school_id: schoolId }).select('participants disappearing_messages is_group').lean();
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isMember = conv.participants.some((p) => String(p.user_id) === String(userId));
    if (!isMember && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to conversation' });
    }

    if (conv.disappearing_messages) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await ChatMessage.deleteMany({ conversation_id: id, createdAt: { $lt: cutoff } });
    }

    const msgFilter = { conversation_id: id, school_id: schoolId };
    if (conv.disappearing_messages) {
      msgFilter.createdAt = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    }

    const messages = await ChatMessage.find(msgFilter).sort({ createdAt: 1 }).limit(100).lean();

    const other = conv.participants.find((p) => String(p.user_id) !== String(userId));
    let isOnline = false;
    if (other && !conv.is_group) {
      const activeSession = await UserSession.findOne({ user_id: other.user_id, status: 'Active', last_active: { $gte: new Date(Date.now() - 3 * 60 * 1000) } }).lean();
      isOnline = Boolean(activeSession);
    }

    res.status(200).json({ success: true, data: messages, conversation: conv, is_online: isOnline, disappearing_messages: Boolean(conv.disappearing_messages) });

    ChatConversation.updateOne({ _id: id, 'participants.user_id': userId }, { $set: { 'participants.$.unread_count': 0, 'participants.$.last_read_at': new Date() } }).catch(() => {});
    ChatMessage.updateMany({ conversation_id: id, read_by: { $ne: userId } }, { $addToSet: { read_by: userId } }).catch(() => {});
    emitChatEvent(schoolId, conv.participants.map((p) => p.user_id), 'messages_read', { conversation_id: id, read_by: userId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
};

module.exports = { getMessages, sendMessage, deleteMessage };
