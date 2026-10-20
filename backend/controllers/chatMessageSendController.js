const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const { emitChatEvent } = require('../utils/chatRealtimeHub');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;
    let { message_text, attachment_url = '', attachment_name = '', reply_to = null, card_payload = null } = req.body;

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

    if (attachment_url && attachment_url.startsWith('data:')) {
      try {
        attachment_url = await uploadToCloudinary(attachment_url, 'eliteedu/chat');
      } catch (uploadErr) {
        return res.status(500).json({ success: false, message: 'Failed to upload attachment to Cloudinary', error: uploadErr.message });
      }
    }

    const finalText = cleanText || card_payload?.head?.title || '';
    const isImage = attachment_url && (attachment_url.includes('cloudinary') || attachment_url.startsWith('data:image') || /\.(jpeg|jpg|gif|png|webp)/i.test(attachment_url));
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

    await ChatConversation.updateOne(
      { _id: id },
      { $set: { last_message_text: previewSummary, last_message_at: new Date(), last_sender_id: userId }, $inc: { 'participants.$[elem].unread_count': 1 } },
      { arrayFilters: [{ 'elem.user_id': { $ne: userId } }] }
    );

    emitChatEvent(schoolId, conv.participants.map((p) => p.user_id), 'new_message', { conversation_id: id, message });
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};

module.exports = { sendMessage };
