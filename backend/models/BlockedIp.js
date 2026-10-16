const mongoose = require('mongoose');

const blockedIpSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', index: true },
    ip_address: { type: String, required: true, trim: true, index: true },
    reason: { type: String, default: 'Administrative block', trim: true },
    blocked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

blockedIpSchema.index({ school_id: 1, ip_address: 1 }, { unique: true });

module.exports = mongoose.model('BlockedIp', blockedIpSchema);
