const mongoose = require('mongoose');

const documentItemSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  file_url: { type: String, trim: true, default: '' },
  file_type: { type: String, trim: true, default: '' },
  uploaded_at: { type: Date, default: Date.now }
}, { _id: true });

const followUpItemSchema = new mongoose.Schema({
  note: { type: String, trim: true, default: '' },
  status: { type: String, trim: true, default: '' },
  followed_up_by: { type: String, trim: true, default: '' },
  created_at: { type: Date, default: Date.now }
}, { _id: true });

const staffApplicantSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    replacement_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    converted_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    photo_url: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    father_name: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    dob: { type: Date, default: null },
    contact_number: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    cnic: { type: String, trim: true, default: '' },
    marital_status: { type: String, trim: true, default: '' },
    applied_on: { type: Date, default: null },
    added_on: { type: Date, default: Date.now },
    department: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    qualification: { type: String, trim: true, default: '' },
    experience_years: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Visiting', ''],
      default: 'Full Time'
    },
    bps_grade: { type: String, trim: true, default: '' },
    expected_salary: { type: Number, default: 0 },
    approved_salary: { type: Number, default: 0 },
    previous_employer: { type: String, trim: true, default: '' },
    skills: { type: String, trim: true, default: '' },
    current_address: { type: String, trim: true, default: '' },
    permanent_address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    area: { type: String, trim: true, default: '' },
    resume_url: { type: String, default: '' },
    resume_name: { type: String, default: '' },
    documents: [documentItemSchema],
    follow_ups: [followUpItemSchema],
    status: {
      type: String,
      enum: ['Pending Verification', 'Verified', 'Approved', 'Converted', 'Rejected'],
      default: 'Pending Verification'
    }
  },
  { timestamps: true }
);

staffApplicantSchema.index({ school_id: 1, status: 1 });
staffApplicantSchema.index({ school_id: 1, campus_id: 1 });

module.exports = mongoose.model('StaffApplicant', staffApplicantSchema);
