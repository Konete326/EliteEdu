const mongoose = require('mongoose');

const cardActionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  action_value: { type: String, required: true },
  style: { type: String, enum: ['Primary', 'Danger', 'Default'], default: 'Primary' }
}, { _id: false });

const cardPayloadSchema = new mongoose.Schema({
  card_type: {
    type: String,
    enum: ['None', 'Leave_Approval', 'Voucher_Approval', 'Fee_Reminder', 'Circular_Notice', 'Student_Lookup', 'Attendance_Summary', 'Custom_Card'],
    default: 'None'
  },
  ref_model: {
    type: String,
    enum: ['LeaveRequest', 'AccountTransaction', 'FeeInvoice', 'None'],
    default: 'None'
  },
  ref_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  head: {
    title: { type: String, default: '' },
    sub_title: { type: String, default: '' },
    status_badge: { type: String, default: '' },
    accent_color: { type: String, default: '#4f46e5' }
  },
  body: {
    text: { type: String, default: '' }
  },
  fields: [{ key: String, value: String }],
  actions: [cardActionSchema],
  action_taken: {
    status: { type: String, default: '' },
    by_name: { type: String, default: '' },
    at: { type: Date, default: null }
  }
}, { _id: false });

const chatMessageSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true, index: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    sender_name: { type: String, required: true },
    sender_role: { type: String, default: 'Admin' },
    sender_avatar: { type: String, default: '' },
    message_text: { type: String, default: '', trim: true },
    attachment_url: { type: String, default: '' },
    attachment_name: { type: String, default: '' },
    card_payload: { type: cardPayloadSchema, default: () => ({ card_type: 'None' }) },
    reply_to: {
      message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', default: null },
      sender_name: { type: String, default: '' },
      message_text: { type: String, default: '' }
    },
    is_edited: { type: Boolean, default: false },
    edited_at: { type: Date, default: null },
    read_by: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversation_id: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
