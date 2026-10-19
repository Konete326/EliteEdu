const InternalMessage = require('../models/InternalMessage');
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
    const channelFilter = ['All_Staff'];
    if (req.user.role === 'Teacher') channelFilter.push('Teachers');
    if (['Admin', 'SuperAdmin'].includes(req.user.role)) channelFilter.push('Admins');

    const query = {
      school_id: schoolId,
      read_by: { $ne: req.user._id },
      $or: [
        { channel: 'Direct', recipient_id: req.user._id },
        { channel: { $in: channelFilter }, sender_id: { $ne: req.user._id } }
      ]
    };

    const unreadCount = await InternalMessage.countDocuments(query);
    const latest = unreadCount > 0 ? await InternalMessage.findOne(query)
      .populate('sender_id', 'name role')
      .sort({ createdAt: -1 })
      .lean() : null;

    res.status(200).json({
      success: true,
      unreadCount,
      latestMessage: latest ? {
        _id: latest._id,
        sender: latest.sender_id?.name || 'Staff Member',
        content: latest.content,
        channel: latest.channel,
        createdAt: latest.createdAt
      } : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStaffDirectory, getUnreadSummary };
