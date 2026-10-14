const mongoose = require('mongoose');
const {
  weeklyTimingSchema, classAssignmentSchema, childSchema, appPermissionsSchema,
  payrollConfigSchema, securityDepositSchema, incrementSchema, loanSchema, followUpSchema, documentSchema
} = require('./staffSubSchemas');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    father_name: { type: String, trim: true, default: '' },
    surname: { type: String, trim: true, default: '' },
    spouse_name: { type: String, trim: true, default: '' },
    nick_name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SuperAdmin', 'Admin', 'Teacher'], required: true },
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    is_active: { type: Boolean, default: true },
    photo_url: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    marital_status: { type: String, default: 'Single' },
    contact_number: { type: String, trim: true, default: '' },
    whatsapp_number: { type: String, trim: true, default: '' },
    cnic: { type: String, trim: true, default: '' },
    cnic_expiry: { type: Date, default: null },
    is_coordinator: { type: Boolean, default: false },
    employee_code: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: 'Academics' },
    designation: {
      type: String,
      enum: [
        'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE_HEADMASTER',
        'SECTION_INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB_QASID',
        'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON', 'OTHER'
      ],
      default: 'PST'
    },
    bps_grade: { type: String, trim: true, default: '' },
    personal_id: { type: String, trim: true, default: '' },
    qualification: { type: String, trim: true, default: '' },
    supervisor: { type: String, trim: true, default: '' },
    joining_date: { type: Date, default: null },
    regularization_date: { type: Date, default: null },
    appointment_order_no: { type: String, trim: true, default: '' },
    appointment_date: { type: Date, default: null },
    basic_salary: { type: Number, default: 0 },
    current_address: { type: String, trim: true, default: '' },
    permanent_address: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    bank_details: {
      bank_name: { type: String, trim: true, default: '' },
      account_title: { type: String, trim: true, default: '' },
      account_number: { type: String, trim: true, default: '' },
      iban: { type: String, trim: true, default: '' },
      branch_code: { type: String, trim: true, default: '' }
    },
    emergency_contact: {
      name: { type: String, trim: true, default: '' },
      relation: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' }
    },
    children: [childSchema],
    weekly_timings: [weeklyTimingSchema],
    class_assignments: [classAssignmentSchema],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }],
    app_permissions: { type: appPermissionsSchema, default: () => ({}) },
    payroll_config: { type: payrollConfigSchema, default: () => ({}) },
    security_deposits: [securityDepositSchema],
    increments: [incrementSchema],
    loans: [loanSchema],
    follow_ups: [followUpSchema],
    documents: [documentSchema]
  },
  { timestamps: true }
);

userSchema.index({ school_id: 1, role: 1 });
userSchema.index({ school_id: 1, employee_code: 1 });

module.exports = mongoose.model('User', userSchema);
