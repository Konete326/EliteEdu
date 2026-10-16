const mongoose = require('mongoose');
const {
  parentDetailsSchema,
  familyMemberSchema,
  academicHistorySchema,
  addressSchema,
  appSettingsSchema,
  documentSchema
} = require('./studentSubSchemas');

const studentSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    grade_admitted: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section_admitted: { type: String, trim: true, default: '' },
    current_grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    current_section: { type: String, trim: true, default: 'A' },
    gr_number: { type: String, required: true, trim: true },
    serial_no: { type: String, trim: true, default: '' },
    family_number: { type: String, trim: true, default: '' },
    portal_username: { type: String, trim: true, default: '' },
    portal_temp_password: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    father_name: { type: String, required: true, trim: true },
    surname: { type: String, trim: true, default: '' },
    mother_guardian_name: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dob: { type: Date, default: null },
    admission_date: { type: Date, default: Date.now },
    b_form: { type: String, trim: true, default: '' },
    contact_number: { type: String, trim: true, default: '' },
    religion: { type: String, trim: true, default: 'Islam' },
    emergency_contact_no: { type: String, trim: true, default: '' },
    photo_url: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Active', 'Left', 'Graduated', 'Suspended'], default: 'Active' },
    blood_group: { type: String, trim: true, default: '' },
    identification_mark: { type: String, trim: true, default: 'Nil' },
    disease_if_any: { type: String, trim: true, default: 'None' },
    caste: { type: String, trim: true, default: '' },
    is_orphan: { type: String, default: 'No' },
    is_osc: { type: String, default: 'No' },
    total_siblings: { type: Number, default: 0 },
    monthly_fee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    father_details: { type: parentDetailsSchema, default: () => ({}) },
    mother_details: { type: parentDetailsSchema, default: () => ({}) },
    parents_cnic: {
      father_cnic: { type: String, trim: true, default: '' },
      mother_cnic: { type: String, trim: true, default: '' }
    },
    family_members: [familyMemberSchema],
    address: { type: addressSchema, default: () => ({}) },
    academic_history: { type: academicHistorySchema, default: () => ({}) },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    app_settings: { type: appSettingsSchema, default: () => ({}) },
    admin_notes: { type: String, trim: true, default: '' },
    additional_notes: { type: String, trim: true, default: '' },
    documents: [documentSchema],
    previous_grade_name: { type: String, trim: true, default: '' },
    last_promoted_at: { type: Date, default: null },
    last_promotion_label: { type: String, trim: true, default: '' },
    latest_exam_percentage: { type: Number, default: null },
    promotion_status: { type: String, enum: ['Eligible', 'Promoted', 'Retained', 'Pending'], default: 'Pending' }
  },
  { timestamps: true }
);

studentSchema.pre('validate', async function () {
  if (!this.campus_id && this.school_id) {
    const campus = await mongoose.model('Campus').findOne({ school_id: this.school_id }).lean();
    if (campus) this.campus_id = campus._id;
  }
  if (!this.current_grade && this.school_id) {
    const grade = await mongoose.model('Grade').findOne({ school_id: this.school_id }).lean();
    if (grade) this.current_grade = grade._id;
  }
});

studentSchema.index({ school_id: 1, gr_number: 1 });
studentSchema.index({ school_id: 1, current_grade: 1, campus_id: 1 });

module.exports = mongoose.model('Student', studentSchema);
