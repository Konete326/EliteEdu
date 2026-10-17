const Notification = require('../models/Notification');

const createSystemNotification = async ({
  school_id,
  campus_id = null,
  title,
  message,
  type = 'System',
  priority = 'Normal',
  target_audience = 'All',
  target_user_id = null,
  action_url = '',
  created_by = null
}) => {
  if (!school_id || !title || !message) return null;
  try {
    return await Notification.create({
      school_id,
      campus_id: campus_id || null,
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      target_audience,
      target_user_id,
      action_url: action_url ? action_url.trim() : '',
      created_by
    });
  } catch (err) {
    return null;
  }
};

module.exports = { createSystemNotification };
