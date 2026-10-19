const mongoose = require('mongoose');

const internalMessageSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  channel: {
    type: String,
    enum: ['All_Staff', 'Teachers', 'Admins', 'Direct'],
    default: 'All_Staff',
    index: true
  },
  content: { type: String, required: true, trim: true },
  attachment_url: { type: String, default: '' },
  attachment_name: { type: String, default: '' },
  is_circular: { type: Boolean, default: false, index: true },
  is_pinned: { type: Boolean, default: false },
  read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('InternalMessage', internalMessageSchema);
