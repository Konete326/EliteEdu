const InternalMessage = require('../models/InternalMessage');
const ChatConversation = require('../models/ChatConversation');
const User = require('../models/User');

const getStaffDirectory = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const users = await User.find({
      school_id: schoolId,
      _id: { $ne: req.user._id },
      role: { $in: ['Admin', 'Teacher', 'Staff'] }
    })
      .select('name email role profile_picture')
      .sort({ name: 1 })
      .lean();

    const unreadAgg = await InternalMessage.aggregate([
      {
        $match: {
          school_id: schoolId,
          channel: 'Direct',
          recipient_id: req.user._id,
          read_by: { $ne: req.user._id }
        }
      },
      { $group: { _id: '$sender_id', count: { $sum: 1 } } }
    ]);

    const unreadMap = {};
    unreadAgg.forEach((u) => { unreadMap[String(u._id)] = u.count; });

    const directory = users.map((u) => ({
      ...u,
      unread_count: unreadMap[String(u._id)] || 0
    }));

    res.status(200).json({ success: true, directory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUnreadSummary = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const userId = req.user._id;

    const chatConvs = await ChatConversation.find({
      school_id: schoolId,
      participants: { $elemMatch: { user_id: userId, unread_count: { $gt: 0 } } }
    }).select('participants last_message_text last_message_at group_name is_group').lean();

    let chatUnread = 0;
    let latestMessage = null;

    for (const c of chatConvs) {
      const p = c.participants?.find((x) => String(x.user_id) === String(userId));
      if (p?.unread_count > 0) {
        chatUnread += p.unread_count;
        if (!latestMessage || new Date(c.last_message_at) > new Date(latestMessage.createdAt)) {
          latestMessage = {
            _id: c._id,
            sender: c.is_group ? c.group_name : 'Staff Member',
            content: c.last_message_text,
            channel: 'Chat',
            createdAt: c.last_message_at
          };
        }
      }
    }

    const channelFilter = ['All_Staff'];
    if (req.user.role === 'Teacher') channelFilter.push('Teachers');
    if (['Admin', 'SuperAdmin'].includes(req.user.role)) channelFilter.push('Admins');

    const query = {
      school_id: schoolId,
      read_by: { $ne: userId },
      $or: [
        { channel: 'Direct', recipient_id: userId },
        { channel: { $in: channelFilter }, sender_id: { $ne: userId } }
      ]
    };

    const internalUnread = await InternalMessage.countDocuments(query);
    if (!latestMessage && internalUnread > 0) {
      const latest = await InternalMessage.findOne(query)
        .populate('sender_id', 'name role')
        .sort({ createdAt: -1 })
        .lean();
      if (latest) {
        latestMessage = {
          _id: latest._id,
          sender: latest.sender_id?.name || 'Staff Member',
          content: latest.content,
          channel: latest.channel,
          createdAt: latest.createdAt
        };
      }
    }

    res.status(200).json({
      success: true,
      unreadCount: chatUnread + internalUnread,
      latestMessage
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStaffDirectory, getUnreadSummary };
