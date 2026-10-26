const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const LeaveRequest = require('../models/LeaveRequest');
const AccountTransaction = require('../models/AccountTransaction');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const handleCardAction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { action_value } = req.body;
    const schoolId = req.user.school_id;
    const userName = req.user.name || 'Admin';

    if (!action_value) {
      return res.status(400).json({ success: false, message: 'action_value is required' });
    }

    const message = await ChatMessage.findOne({ _id: messageId, school_id: schoolId });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    const card = message.card_payload;
    if (!card || card.card_type === 'None') {
      return res.status(400).json({ success: false, message: 'Message has no interactive card' });
    }

    if (card.action_taken?.status) {
      return res.status(400).json({ success: false, message: `Action already taken: ${card.action_taken.status}` });
    }

    if (['approve', 'reject'].includes(action_value) && ['Leave_Approval', 'Voucher_Approval'].includes(card.card_type)) {
      const userRole = (req.user?.role || '').toLowerCase();
      const isAdmin = ['admin', 'superadmin'].includes(userRole);
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: 'Only Administrators can approve or reject this request' });
      }
    }

    const normalizedStatus = action_value === 'approve'
      ? 'Approved'
      : action_value === 'reject'
        ? 'Rejected'
        : 'Acknowledged';

    if (card.ref_model === 'LeaveRequest' && card.ref_id) {
      await LeaveRequest.findOneAndUpdate(
        { _id: card.ref_id, school_id: schoolId },
        { $set: { status: normalizedStatus } }
      );
    } else if (card.ref_model === 'AccountTransaction' && card.ref_id) {
      await AccountTransaction.findOneAndUpdate(
        { _id: card.ref_id, school_id: schoolId },
        { $set: { approval_status: normalizedStatus } }
      );
    }

    message.card_payload.action_taken = {
      status: normalizedStatus,
      by_name: userName,
      at: new Date()
    };
    if (message.card_payload.head) {
      message.card_payload.head.status_badge = normalizedStatus;
    }
    message.markModified('card_payload');
    await message.save();

    const conv = await ChatConversation.findById(message.conversation_id).select('participants').lean();
    if (conv) {
      const uids = conv.participants.map((p) => p.user_id);
      emitChatEvent(schoolId, uids, 'card_updated', {
        message_id: message._id,
        conversation_id: message.conversation_id,
        card_payload: message.card_payload
      });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process card action', error: error.message });
  }
};

module.exports = { handleCardAction };
