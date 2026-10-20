const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    user_model: { type: String, enum: ['User', 'Student'], default: 'User' },
    name: { type: String, required: true },
    role_label: { type: String, default: 'Staff' },
    avatar_url: { type: String, default: '' },
    unread_count: { type: Number, default: 0 },
    is_favorite: { type: Boolean, default: false },
    is_pinned: { type: Boolean, default: false },
    is_muted: { type: Boolean, default: false },
    last_read_at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const chatConversationSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    is_group: { type: Boolean, default: false, index: true },
    group_name: { type: String, trim: true, default: '' },
    group_type: {
      type: String,
      enum: ['Direct', 'Class_Group', 'Staff_Group', 'Custom_Group'],
      default: 'Direct'
    },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section: { type: String, trim: true, default: '' },
    participants: { type: [participantSchema], default: [] },
    disappearing_messages: { type: Boolean, default: false },
    last_message_text: { type: String, default: '' },
    last_message_at: { type: Date, default: Date.now, index: true },
    last_sender_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

chatConversationSchema.index({ school_id: 1, 'participants.user_id': 1 });
chatConversationSchema.index({ school_id: 1, is_group: 1, last_message_at: -1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
