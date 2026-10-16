const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token_id: { type: String, required: true, index: true },
    ip_address: { type: String, default: '10.0.0.2', trim: true },
    device: { type: String, default: '—', trim: true },
    last_active: { type: Date, default: Date.now, index: true },
    expires_at: { type: Date, required: true, index: true },
    status: { type: String, enum: ['Active', 'Revoked'], default: 'Active', index: true }
  },
  { timestamps: true }
);

userSessionSchema.index({ school_id: 1, user_id: 1, status: 1 });

module.exports = mongoose.model('UserSession', userSessionSchema);
