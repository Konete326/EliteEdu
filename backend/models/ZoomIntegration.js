const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema(
  {
    event: { type: String, default: '' },
    status: { type: String, default: 'Success' },
    timestamp: { type: Date, default: Date.now },
    summary: { type: String, default: '' }
  },
  { _id: false }
);

const zoomIntegrationSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, unique: true, index: true },
    client_id: { type: String, default: '', trim: true },
    client_secret: { type: String, default: '', trim: true },
    account_id: { type: String, default: '', trim: true },
    bot_jid: { type: String, default: '', trim: true },
    verification_token: { type: String, default: '', trim: true },
    webhook_url: { type: String, default: '', trim: true },
    is_active: { type: Boolean, default: false },
    access_token: { type: String, default: '' },
    token_expires_at: { type: Date, default: null },
    last_verified_at: { type: Date, default: null },
    last_error: { type: String, default: '' },
    webhook_logs: [webhookLogSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ZoomIntegration', zoomIntegrationSchema);
