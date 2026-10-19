const mongoose = require('mongoose');

const feeHeadItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 }
}, { _id: false });

const feeInvoiceSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    challan_no: { type: String, required: true, trim: true, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null, index: true },
    section: { type: String, trim: true, default: 'A' },
    billing_month: { type: String, required: true, trim: true, index: true },
    issue_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    fee_heads: [feeHeadItemSchema],
    gross_amount: { type: Number, default: 0, min: 0 },
    arrears_amount: { type: Number, default: 0, min: 0 },
    discount_amount: { type: Number, default: 0, min: 0 },
    late_fine: { type: Number, default: 0, min: 0 },
    net_payable: { type: Number, required: true, min: 0 },
    paid_amount: { type: Number, default: 0, min: 0 },
    balance_due: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid', 'Overdue', 'Void'],
      default: 'Unpaid',
      index: true
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Bank Deposit', 'Online Transfer', 'Cheque'],
      default: 'Cash'
    },
    payment_date: { type: Date, default: null },
    transaction_ref: { type: String, trim: true, default: '' },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    collector_name: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

feeInvoiceSchema.index({ school_id: 1, billing_month: 1, student_id: 1 });
feeInvoiceSchema.index({ school_id: 1, status: 1, due_date: 1 });

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);
