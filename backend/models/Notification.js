const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    campus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
      default: null
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Announcement', 'Academic', 'Attendance', 'Promotion', 'Admission', 'Security', 'System'],
      default: 'Announcement'
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal'
    },
    target_audience: {
      type: String,
      enum: ['All', 'Admins', 'Teachers', 'Students', 'Specific_User'],
      default: 'All'
    },
    target_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    action_url: {
      type: String,
      trim: true,
      default: ''
    },
    read_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

notificationSchema.index({ school_id: 1, createdAt: -1 });
notificationSchema.index({ school_id: 1, target_audience: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
