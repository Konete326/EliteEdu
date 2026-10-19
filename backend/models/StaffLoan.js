const mongoose = require('mongoose');

const staffLoanSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    record_type: {
      type: String,
      enum: ['Loan', 'Advance_Salary', 'Security_Deposit'],
      default: 'Loan',
      index: true
    },
    principal_amount: { type: Number, required: true, min: 0 },
    monthly_installment: { type: Number, required: true, min: 0 },
    paid_Or_deducted_amount: { type: Number, default: 0, min: 0 },
    remaining_balance: { type: Number, required: true, min: 0 },
    hold_months: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['Active', 'Completed', 'On_Hold'],
      default: 'Active',
      index: true
    },
    remarks: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

staffLoanSchema.index({ school_id: 1, staff_id: 1, status: 1 });

module.exports = mongoose.model('StaffLoan', staffLoanSchema);
