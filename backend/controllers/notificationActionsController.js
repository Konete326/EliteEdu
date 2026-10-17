const Notification = require('../models/Notification');

const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { read_by: userId } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id || user.id;
    const query = user.school_id ? { school_id: user.school_id } : {};
    if (user.role === 'Admin') {
      query.$or = [{ target_audience: { $in: ['All', 'Admins'] } }, { target_user_id: userId }, { created_by: userId }];
    } else if (user.role === 'Teacher') {
      query.$or = [{ target_audience: { $in: ['All', 'Teachers'] } }, { target_user_id: userId }];
    } else if (user.role === 'Student') {
      query.$or = [{ target_audience: { $in: ['All', 'Students'] } }, { target_user_id: userId }];
    }
    await Notification.updateMany(query, { $addToSet: { read_by: userId } });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'SuperAdmin') {
      query.school_id = req.user.school_id;
    }
    const notification = await Notification.findOneAndDelete(query);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { markAsRead, markAllAsRead, deleteNotification };
