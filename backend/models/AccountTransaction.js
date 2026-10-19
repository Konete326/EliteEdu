const mongoose = require('mongoose');

const accountTransactionSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    voucher_no: { type: String, required: true, index: true },
    voucher_type: {
      type: String,
      enum: ['Income', 'Expense', 'Payment_Voucher', 'Receipt_Voucher', 'Journal_Voucher'],
      required: true,
      index: true
    },
    account_head_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountHead', required: true },
    account_head_name: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    transaction_date: { type: Date, default: Date.now, index: true },
    payment_mode: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online'],
      default: 'Cash'
    },
    reference_no: { type: String, trim: true, default: '' },
    cost_center: { type: String, trim: true, default: 'Main Campus' },
    description: { type: String, trim: true, default: '' },
    attachment_url: { type: String, default: '' },
    approval_status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved',
      index: true
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

accountTransactionSchema.index({ school_id: 1, transaction_date: -1 });
accountTransactionSchema.index({ school_id: 1, voucher_type: 1 });

module.exports = mongoose.model('AccountTransaction', accountTransactionSchema);
