const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    father_name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SuperAdmin', 'Admin', 'Teacher'], required: true },
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    is_active: { type: Boolean, default: true },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    cnic: { type: String, trim: true, default: '' },
    contact_number: { type: String, trim: true, default: '' },
    whatsapp_number: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    employee_code: { type: String, trim: true, default: '' },
    personal_id: { type: String, trim: true, default: '' },
    joining_date: { type: Date, default: null },
    regularization_date: { type: Date, default: null },
    appointment_order_no: { type: String, trim: true, default: '' },
    appointment_date: { type: Date, default: null },
    bps_grade: { type: String, trim: true, default: '' },
    designation: {
      type: String,
      enum: [
        'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE_HEADMASTER',
        'SECTION_INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB_QASID',
        'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON', 'OTHER'
      ],
      default: 'OTHER'
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }],
    bank_details: {
      bank_name: { type: String, trim: true, default: '' },
      account_title: { type: String, trim: true, default: '' },
      account_number: { type: String, trim: true, default: '' },
      iban: { type: String, trim: true, default: '' },
      branch_code: { type: String, trim: true, default: '' }
    }
  },
  { timestamps: true }
);

userSchema.index({ school_id: 1, role: 1 });
userSchema.index({ school_id: 1, employee_code: 1 });

module.exports = mongoose.model('User', userSchema);
