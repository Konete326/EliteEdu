const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const { buildSlashCommandCard } = require('../utils/slashCommandBuilders');
const { emitChatEvent } = require('../utils/chatRealtimeHub');

const handleSlashCommand = async (req, res) => {
  try {
    const conversationId = req.params.conversationId || req.params.id;
    const commandText = req.body.commandText || req.body.message_text;
    const schoolId = req.user.school_id;

    if (!commandText || !commandText.trim()) {
      return res.status(400).json({ success: false, message: 'commandText is required' });
    }

    const conv = await ChatConversation.findOne({ _id: conversationId, school_id: schoolId });
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const cardPayload = await buildSlashCommandCard({
      schoolId,
      user: req.user,
      commandText: commandText.trim()
    });

    const commandName = commandText.trim().split(' ')[0];
    const message = await ChatMessage.create({
      school_id: schoolId,
      conversation_id: conv._id,
      sender_id: req.user._id || req.user.id,
      sender_name: req.user.name || 'Staff',
      sender_role: req.user.role || 'Admin',
      sender_avatar: req.user.avatar || '',
      message_text: `Slash command: ${commandName}`,
      card_payload: cardPayload,
      read_by: [req.user._id || req.user.id]
    });

    conv.last_message = {
      text: cardPayload.head?.title || commandName,
      sender_name: req.user.name || 'Staff',
      at: new Date()
    };
    await conv.save();

    const uids = conv.participants.map((p) => p.user_id);
    emitChatEvent(schoolId, uids, 'new_message', {
      conversation_id: conv._id,
      message
    });

    if (cardPayload.is_broadcast) {
      const otherConvs = await ChatConversation.find({
        school_id: schoolId,
        _id: { $ne: conv._id }
      }).select('_id participants');

      await Promise.all(
        otherConvs.map(async (c) => {
          const extra = await ChatMessage.create({
            school_id: schoolId,
            conversation_id: c._id,
            sender_id: req.user._id || req.user.id,
            sender_name: req.user.name || 'Staff',
            sender_role: req.user.role || 'Admin',
            message_text: `Broadcast: ${cardPayload.head?.title || 'Notice'}`,
            card_payload: cardPayload,
            read_by: [req.user._id || req.user.id]
          });
          c.last_message_text = cardPayload.head?.title || 'Notice';
          c.last_message_at = new Date();
          await c.save();
          emitChatEvent(schoolId, c.participants.map((p) => p.user_id), 'new_message', { conversation_id: c._id, message: extra });
        })
      );
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { handleSlashCommand };
