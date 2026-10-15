const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    grade_admitted: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section_admitted: { type: String, trim: true, default: '' },
    current_grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    current_section: { type: String, trim: true, default: 'A' },
    gr_number: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    father_name: { type: String, required: true, trim: true },
    surname: { type: String, trim: true, default: '' },
    mother_guardian_name: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dob: { type: Date, default: null },
    admission_date: { type: Date, default: Date.now },
    b_form: { type: String, trim: true, default: '' },
    contact_number: { type: String, trim: true, default: '' },
    religion: { type: String, trim: true, default: '' },
    emergency_contact_no: { type: String, trim: true, default: '' },
    photo_url: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Active', 'Left', 'Graduated', 'Suspended'], default: 'Active' },
    monthly_fee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    customized_fee_structure: { type: mongoose.Schema.Types.Mixed, default: {} },
    family_number: { type: String, trim: true, default: '' },
    parents_cnic: {
      father_cnic: { type: String, trim: true, default: '' },
      mother_cnic: { type: String, trim: true, default: '' },
      guardian_cnic: { type: String, trim: true, default: '' }
    },
    family_members: [
      {
        relation: { type: String, trim: true, default: '' },
        name: { type: String, trim: true, default: '' },
        cnic: { type: String, trim: true, default: '' },
        occupation: { type: String, trim: true, default: '' },
        profession: { type: String, trim: true, default: '' },
        education: { type: String, trim: true, default: '' },
        monthly_income: { type: Number, default: 0 },
        employer: { type: String, trim: true, default: '' },
        email: { type: String, trim: true, default: '' },
        office_contact: { type: String, trim: true, default: '' },
        office_address: { type: String, trim: true, default: '' }
      }
    ],
    address: {
      current_address: { type: String, trim: true, default: '' },
      permanent_address: { type: String, trim: true, default: '' },
      area: { type: String, trim: true, default: '' }
    },
    academic_history: {
      last_institute: { type: String, trim: true, default: '' },
      previous_school: { type: String, trim: true, default: '' },
      previous_id_roll_no: { type: String, trim: true, default: '' },
      last_class: { type: String, trim: true, default: '' },
      last_session: { type: String, trim: true, default: '' },
      last_result: { type: String, trim: true, default: '' }
    },
    admission_test: {
      test_date: { type: Date, default: null },
      status: { type: String, trim: true, default: '' },
      remarks: { type: String, trim: true, default: '' },
      test_completed: { type: Boolean, default: false },
      test_passed: { type: Boolean, default: false },
      payment_received: { type: Boolean, default: false }
    },
    admission_interview: {
      interview_date: { type: Date, default: null },
      status: { type: String, trim: true, default: '' },
      remarks: { type: String, trim: true, default: '' }
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    app_settings: {
      edit_profile: { type: Boolean, default: true },
      homework: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      timetable: { type: Boolean, default: true },
      online_classes: { type: Boolean, default: true },
      lectures: { type: Boolean, default: true },
      quizzes: { type: Boolean, default: true },
      result: { type: Boolean, default: true },
      datesheet: { type: Boolean, default: true },
      dues: { type: Boolean, default: true },
      feedback: { type: Boolean, default: true },
      counseling: { type: Boolean, default: true },
      lost_and_found: { type: Boolean, default: true },
      resources: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      library: { type: Boolean, default: true },
      consent: { type: Boolean, default: true },
      circulars: { type: Boolean, default: true },
      leave_request: { type: Boolean, default: true },
      news_feed: { type: Boolean, default: true }
    },
    admin_notes: { type: String, trim: true, default: '' },
    additional_notes: { type: String, trim: true, default: '' },
    documents: [{ title: String, file_url: String, file_name: String, uploaded_at: { type: Date, default: Date.now } }],
    follow_ups: [{ date: { type: Date, default: Date.now }, note: String, user: String }]
  },
  { timestamps: true }
);

studentSchema.index({ school_id: 1, gr_number: 1 });
studentSchema.index({ school_id: 1, current_grade: 1, campus_id: 1 });

module.exports = mongoose.model('Student', studentSchema);
