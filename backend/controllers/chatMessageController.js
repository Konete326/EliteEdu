const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;

    const conv = await ChatConversation.findOne({ _id: id, school_id: schoolId }).select('participants').lean();
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isMember = conv.participants.some((p) => String(p.user_id) === String(userId));
    if (!isMember && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to conversation' });
    }

    const messages = await ChatMessage.find({ conversation_id: id, school_id: schoolId }).sort({ createdAt: 1 }).limit(100).lean();
    res.status(200).json({ success: true, data: messages, conversation: conv });

    ChatConversation.updateOne(
      { _id: id, 'participants.user_id': userId },
      { $set: { 'participants.$.unread_count': 0, 'participants.$.last_read_at': new Date() } }
    ).catch(() => {});
    ChatMessage.updateMany({ conversation_id: id, read_by: { $ne: userId } }, { $addToSet: { read_by: userId } }).catch(() => {});
    emitChatEvent(schoolId, conv.participants.map((p) => p.user_id), 'messages_read', { conversation_id: id, read_by: userId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;
    const { message_text, attachment_url = '', attachment_name = '', reply_to = null, card_payload = null } = req.body;

    const conv = await ChatConversation.findOne({ _id: id, school_id: schoolId });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isMember = conv.participants.some((p) => String(p.user_id) === String(userId));
    if (!isMember) return res.status(403).json({ success: false, message: 'Not a conversation participant' });

    const input = message_text ?? req.body.text ?? req.body.content ?? req.body.message ?? '';
    let cleanText = String(input || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    if (cleanText.length > 4096) cleanText = cleanText.slice(0, 4096);

    if (!cleanText && !attachment_url && (!card_payload || card_payload.card_type === 'None')) {
      return res.status(400).json({ success: false, message: 'Message text, card, or attachment is required' });
    }

    const finalText = cleanText || card_payload?.head?.title || '';
    const isImage = attachment_url && (attachment_url.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp)/i.test(attachment_url));
    const previewSummary = cleanText || card_payload?.head?.title || (isImage ? '📷 Photo' : (attachment_name || 'Attachment'));

    const message = await ChatMessage.create({
      school_id: schoolId,
      conversation_id: id,
      sender_id: userId,
      sender_name: req.user.name,
      sender_role: req.user.designation || req.user.role || 'Staff',
      sender_avatar: req.user.photo_url || '',
      message_text: finalText,
      attachment_url,
      attachment_name,
      card_payload: card_payload || { card_type: 'None' },
      reply_to: reply_to?.message_id ? reply_to : null,
      read_by: [userId]
    });

    conv.last_message_text = previewSummary;
    conv.last_message_at = new Date();
    conv.last_sender_id = userId;
    conv.participants.forEach((p) => {
      if (String(p.user_id) !== String(userId)) p.unread_count = (p.unread_count || 0) + 1;
    });
    await conv.save();

    emitChatEvent(schoolId, conv.participants.map((p) => p.user_id), 'new_message', { conversation_id: id, message });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};

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

module.exports = { getMessages, sendMessage, deleteMessage };
