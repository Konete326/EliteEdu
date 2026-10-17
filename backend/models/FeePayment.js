const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    receipt_number: { type: String, required: true, trim: true, index: true },
    challan_number: { type: String, trim: true, default: '' },
    fee_month: { type: String, required: true, trim: true },
    payment_date: { type: Date, default: Date.now, index: true },
    base_fee: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    fine: { type: Number, default: 0, min: 0 },
    other_charges: { type: Number, default: 0, min: 0 },
    net_payable: { type: Number, required: true, min: 0 },
    paid_amount: { type: Number, required: true, min: 0 },
    balance_due: { type: Number, default: 0 },
    payment_method: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Online / Card', 'Cheque'],
      default: 'Cash'
    },
    reference_number: { type: String, trim: true, default: '' },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    collector_name: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Unpaid', 'Void'],
      default: 'Paid',
      index: true
    }
  },
  { timestamps: true }
);

feePaymentSchema.index({ school_id: 1, fee_month: 1, student_id: 1 });
feePaymentSchema.index({ school_id: 1, createdAt: -1 });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
