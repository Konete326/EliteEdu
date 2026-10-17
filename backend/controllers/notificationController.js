const Notification = require('../models/Notification');

const getAudienceFilter = (user) => {
  if (user.role === 'SuperAdmin') return {};
  const or = [{ target_audience: 'All' }, { target_user_id: user._id || user.id }];
  if (user.role === 'Admin') {
    or.push({ target_audience: 'Admins' });
    or.push({ created_by: user._id || user.id });
  } else if (user.role === 'Teacher') {
    or.push({ target_audience: 'Teachers' });
  } else if (user.role === 'Student') {
    or.push({ target_audience: 'Students' });
  }
  return { $or: or };
};

const getNotifications = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id || user.id;
    const schoolId = user.school_id;
    const query = schoolId ? { school_id: schoolId } : {};

    Object.assign(query, getAudienceFilter(user));

    if (req.query.type && req.query.type !== 'All') {
      query.type = req.query.type;
    }
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }
    if (req.query.campus_id) {
      query.$or = (query.$or || []).concat([{ campus_id: req.query.campus_id }, { campus_id: null }]);
    }
    if (req.query.unread_only === 'true') {
      query.read_by = { $ne: userId };
    }
    if (req.query.search && req.query.search.trim()) {
      const reg = new RegExp(req.query.search.trim(), 'i');
      query.$and = (query.$and || []).concat([{ $or: [{ title: reg }, { message: reg }] }]);
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .populate('created_by', 'name role')
        .populate('campus_id', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({
        ...getAudienceFilter(user),
        ...(schoolId ? { school_id: schoolId } : {}),
        read_by: { $ne: userId }
      })
    ]);

    const formatted = items.map((n) => ({
      ...n,
      is_read: Array.isArray(n.read_by) && n.read_by.some((r) => String(r) === String(userId))
    }));

    res.status(200).json({
      success: true,
      notifications: formatted,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, target_audience, target_user_id, campus_id, action_url } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }
    const schoolId = req.user.school_id || req.body.school_id;
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'School scope is required' });
    }
    const item = await Notification.create({
      school_id: schoolId,
      campus_id: campus_id || null,
      title: title.trim(),
      message: message.trim(),
      type: type || 'Announcement',
      priority: priority || 'Normal',
      target_audience: target_audience || 'All',
      target_user_id: target_user_id || null,
      action_url: action_url ? action_url.trim() : '',
      created_by: req.user._id || req.user.id
    });
    const populated = await Notification.findById(item._id)
      .populate('created_by', 'name role')
      .populate('campus_id', 'name code');
    res.status(201).json({ success: true, notification: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNotifications, createNotification };
