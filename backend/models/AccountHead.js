const mongoose = require('mongoose');

const accountHeadSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Asset', 'Liability', 'Income', 'Expense', 'Equity'],
      required: true,
      index: true
    },
    opening_balance: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

accountHeadSchema.index({ school_id: 1, code: 1 }, { unique: true });
accountHeadSchema.index({ school_id: 1, category: 1 });

module.exports = mongoose.model('AccountHead', accountHeadSchema);
