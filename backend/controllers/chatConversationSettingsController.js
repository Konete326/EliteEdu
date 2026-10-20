const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const conv = await ChatConversation.findOne({ _id: id, school_id: req.user.school_id });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const p = conv.participants.find((item) => String(item.user_id) === String(userId));
    if (!p) return res.status(403).json({ success: false, message: 'Not a participant' });

    p.is_pinned = !p.is_pinned;
    await conv.save();

    res.status(200).json({ success: true, is_pinned: p.is_pinned });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle pin', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { is_muted, disappearing_messages } = req.body;
    const conv = await ChatConversation.findOne({ _id: id, school_id: req.user.school_id });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const p = conv.participants.find((item) => String(item.user_id) === String(userId));
    if (is_muted !== undefined && p) {
      p.is_muted = Boolean(is_muted);
    }
    if (disappearing_messages !== undefined) {
      conv.disappearing_messages = Boolean(disappearing_messages);
    }
    await conv.save();

    res.status(200).json({
      success: true,
      data: { is_muted: Boolean(p?.is_muted), disappearing_messages: Boolean(conv.disappearing_messages) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

const clearChat = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.school_id;
    const conv = await ChatConversation.findOne({ _id: id, school_id: schoolId });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    await ChatMessage.deleteMany({ conversation_id: id, school_id: schoolId });

    conv.last_message_text = '';
    await conv.save();

    const uids = conv.participants.map((p) => p.user_id);
    emitChatEvent(schoolId, uids, 'chat_cleared', { conversation_id: id });

    res.status(200).json({ success: true, message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear chat', error: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.school_id;
    const conv = await ChatConversation.findOne({ _id: id, school_id: schoolId });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    await ChatMessage.deleteMany({ conversation_id: id, school_id: schoolId });
    await ChatConversation.deleteOne({ _id: id, school_id: schoolId });

    const uids = conv.participants.map((p) => p.user_id);
    emitChatEvent(schoolId, uids, 'conversation_deleted', { conversation_id: id });

    res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete conversation', error: error.message });
  }
};

module.exports = { togglePin, updateSettings, clearChat, deleteConversation };
