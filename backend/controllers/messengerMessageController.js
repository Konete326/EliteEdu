const InternalMessage = require('../models/InternalMessage');

const getMessages = async (req, res) => {
  try {
    const { channel, recipient_id, is_circular } = req.query;
    const schoolId = req.schoolId || req.user?.school_id;
    const query = { school_id: schoolId };

    if (is_circular === 'true') {
      query.is_circular = true;
    } else if (channel === 'Direct' && recipient_id) {
      query.channel = 'Direct';
      query.$or = [
        { sender_id: req.user._id, recipient_id },
        { sender_id: recipient_id, recipient_id: req.user._id }
      ];
    } else if (channel) {
      query.channel = channel;
    }

    const messages = await InternalMessage.find(query)
      .populate('sender_id', 'name email role profile_picture')
      .populate('recipient_id', 'name email role profile_picture')
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { channel = 'All_Staff', recipient_id, content, attachment_url, attachment_name, is_circular, is_pinned } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const schoolId = req.schoolId || req.user?.school_id || req.body.school_id;
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'School association is required to send messages' });
    }

    const message = await InternalMessage.create({
      school_id: schoolId,
      sender_id: req.user._id,
      recipient_id: channel === 'Direct' ? recipient_id : null,
      channel,
      content: content.trim(),
      attachment_url: attachment_url || '',
      attachment_name: attachment_name || '',
      is_circular: Boolean(is_circular),
      is_pinned: Boolean(is_pinned),
      read_by: [req.user._id]
    });

    const populated = await InternalMessage.findById(message._id)
      .populate('sender_id', 'name email role profile_picture')
      .populate('recipient_id', 'name email role profile_picture')
      .lean();

    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const togglePin = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const msg = await InternalMessage.findOne({ _id: req.params.id, school_id: schoolId });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    msg.is_pinned = !msg.is_pinned;
    await msg.save();
    res.status(200).json({ success: true, is_pinned: msg.is_pinned });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { sender_id, channel } = req.body;
    const schoolId = req.schoolId || req.user?.school_id;
    const query = { school_id: schoolId, read_by: { $ne: req.user._id } };
    if (channel === 'Direct' && sender_id) {
      query.channel = 'Direct';
      query.sender_id = sender_id;
      query.recipient_id = req.user._id;
    } else if (channel) {
      query.channel = channel;
    }
    await InternalMessage.updateMany(query, { $addToSet: { read_by: req.user._id } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMessages, sendMessage, togglePin, markAsRead };
