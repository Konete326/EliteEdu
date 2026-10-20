const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const submitFormPoll = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const schoolId = req.user.school_id;
    const { option_key, values = {} } = req.body;

    const message = await ChatMessage.findOne({ _id: messageId, school_id: schoolId });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    const card = message.card_payload;
    if (!card || !['Interactive_Poll', 'Interactive_Form'].includes(card.card_type)) {
      return res.status(400).json({ success: false, message: 'Message is not an interactive poll or form' });
    }

    const isExpired = card.expires_at && new Date() > new Date(card.expires_at);
    if (card.is_closed || isExpired) {
      return res.status(400).json({ success: false, message: 'This poll or form has expired or been closed' });
    }

    const conv = await ChatConversation.findOne({ _id: message.conversation_id, school_id: schoolId }).select('participants').lean();
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isMember = conv.participants.some((p) => String(p.user_id) === String(userId));
    if (!isMember && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this conversation' });
    }

    const existingSub = card.submissions.find((s) => String(s.user_id) === String(userId));

    if (card.card_type === 'Interactive_Poll') {
      if (!option_key) return res.status(400).json({ success: false, message: 'Option key is required' });

      const targetOption = card.poll_options.find((o) => o.key === option_key);
      if (!targetOption) return res.status(400).json({ success: false, message: 'Selected option not found' });

      if (existingSub) {
        if (existingSub.option_key === option_key) {
          return res.status(200).json({ success: true, data: message });
        }
        const oldOption = card.poll_options.find((o) => o.key === existingSub.option_key);
        if (oldOption && oldOption.vote_count > 0) oldOption.vote_count -= 1;
        existingSub.option_key = option_key;
        existingSub.submitted_at = new Date();
      } else {
        card.submissions.push({
          user_id: userId,
          user_name: req.user.name,
          option_key,
          submitted_at: new Date()
        });
        card.total_votes = (card.total_votes || 0) + 1;
      }
      targetOption.vote_count = (targetOption.vote_count || 0) + 1;
    } else {
      if (existingSub) {
        return res.status(400).json({ success: false, message: 'You have already submitted this form' });
      }
      card.submissions.push({
        user_id: userId,
        user_name: req.user.name,
        values,
        submitted_at: new Date()
      });
    }

    message.markModified('card_payload');
    await message.save();

    emitChatEvent(schoolId, conv.participants.map((p) => p.user_id), 'card_updated', {
      message_id: message._id,
      card_payload: message.card_payload
    });

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Submission failed', error: error.message });
  }
};

module.exports = { submitFormPoll };
