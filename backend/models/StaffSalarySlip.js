const mongoose = require('mongoose');

const staffSalarySlipSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    slip_no: { type: String, required: true, index: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salary_month: { type: String, required: true, index: true },
    basic_salary: { type: Number, default: 0, min: 0 },
    house_rent_allowance: { type: Number, default: 0, min: 0 },
    medical_allowance: { type: Number, default: 0, min: 0 },
    conveyance_allowance: { type: Number, default: 0, min: 0 },
    bonus_or_encashment: { type: Number, default: 0, min: 0 },
    present_days: { type: Number, default: 26 },
    absent_days: { type: Number, default: 0 },
    leave_days: { type: Number, default: 0 },
    late_count: { type: Number, default: 0 },
    absent_deduction: { type: Number, default: 0, min: 0 },
    loan_deduction: { type: Number, default: 0, min: 0 },
    security_deposit_deduction: { type: Number, default: 0, min: 0 },
    tax_deduction: { type: Number, default: 0, min: 0 },
    gross_salary: { type: Number, default: 0, min: 0 },
    total_deductions: { type: Number, default: 0, min: 0 },
    net_payable: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Paid'],
      default: 'Draft',
      index: true
    },
    payment_date: { type: Date, default: null },
    payment_mode: { type: String, default: 'Bank Transfer' }
  },
  { timestamps: true }
);

staffSalarySlipSchema.index({ school_id: 1, salary_month: 1, staff_id: 1 }, { unique: true });

module.exports = mongoose.model('StaffSalarySlip', staffSalarySlipSchema);
