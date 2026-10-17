const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  follow_up_date: { type: Date, default: Date.now },
  next_date: { type: Date, default: null },
  channel: { type: String, enum: ['Call', 'WhatsApp', 'Visit', 'SMS', 'Email'], default: 'Call' },
  outcome: { type: String, default: 'Contacted' },
  notes: { type: String, required: true },
  logged_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  logged_by_name: { type: String, default: '' }
}, { timestamps: true });

const CrmLeadSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
  student_name: { type: String, required: true, trim: true },
  father_name: { type: String, trim: true, default: '' },
  surname: { type: String, trim: true, default: '' },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
  class_name: { type: String, trim: true, default: '' },
  country: { type: String, default: 'Pakistan' },
  tags: [{ type: String, trim: true }],
  contact_country_code: { type: String, default: '+92' },
  contact_number: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  inquiry_date: { type: Date, default: Date.now },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  age: { type: Number, default: null },
  dob: { type: Date, default: null },
  academic_session: { type: String, default: '2026-2027' },
  message: { type: String, trim: true, default: '' },
  lead_status: { type: String, default: 'New Inquiry', index: true },
  lead_source: { type: String, default: 'Walk-in' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  tag_label: { type: String, trim: true, default: '' },
  purpose: { type: String, trim: true, default: 'Admission inquiry' },
  expected_enrollment_date: { type: Date, default: null },
  is_pinned: { type: Boolean, default: false },
  is_converted: { type: Boolean, default: false, index: true },
  converted_student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  converted_at: { type: Date, default: null },
  additional_info: {
    previous_school: { type: String, default: '' },
    last_class: { type: String, default: '' },
    father_occupation: { type: String, default: '' },
    mother_name: { type: String, default: '' },
    mother_phone: { type: String, default: '' },
    expected_discount: { type: Number, default: 0 },
    address: { type: String, default: '' }
  },
  siblings: [{
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: { type: String, default: '' },
    gr_number: { type: String, default: '' },
    class_name: { type: String, default: '' }
  }],
  checklist: {
    prospectus_issued: { type: Boolean, default: false },
    campus_tour: { type: Boolean, default: false },
    admission_test: { type: Boolean, default: false },
    parent_interview: { type: Boolean, default: false },
    fee_discussed: { type: Boolean, default: false }
  },
  documents: [{
    title: { type: String, default: '' },
    file_url: { type: String, default: '' },
    uploaded_at: { type: Date, default: Date.now }
  }],
  next_follow_up: { type: Date, default: null, index: true },
  follow_ups: [FollowUpSchema],
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

CrmLeadSchema.index({ school_id: 1, campus_id: 1, lead_status: 1 });
CrmLeadSchema.index({ school_id: 1, student_name: 'text', contact_number: 'text', email: 'text' });

module.exports = mongoose.model('CrmLead', CrmLeadSchema);
