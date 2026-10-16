const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null, index: true },
    school_name: { type: String, trim: true, default: 'Global / System' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    user_name: { type: String, default: 'Anonymous', trim: true },
    user_role: { type: String, default: 'Guest', trim: true },
    category: {
      type: String,
      enum: ['CONSOLE_ERROR', 'NETWORK_ERROR', 'RUNTIME_ERROR', 'SERVER_ERROR', 'USER_ACTIVITY'],
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
      default: 'ERROR'
    },
    message: { type: String, required: true, trim: true },
    page_url: { type: String, trim: true, default: '' },
    last_clicked_element: { type: String, trim: true, default: '' },
    endpoint: { type: String, trim: true, default: '' },
    method: { type: String, trim: true, default: '' },
    status_code: { type: Number, default: null },
    stack_trace: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, expires: 604800 }
  },
  {
    timestamps: false
  }
);

systemLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
