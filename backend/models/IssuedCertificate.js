const mongoose = require('mongoose');

const issuedCertificateSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    certificate_no: { type: String, required: true, index: true },
    template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', default: null },
    template_name: { type: String, required: true, trim: true },
    heading: { type: String, default: '' },
    sub_heading: { type: String, default: '' },
    custom_slogan: { type: String, default: '' },
    design_style: { type: String, default: 'academic_gold_hatch' },
    orientation: { type: String, enum: ['landscape', 'portrait'], default: 'landscape' },
    accent_color: { type: String, default: '#b59449' },
    recipient_type: { type: String, enum: ['Student', 'Staff'], required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    recipient_name: { type: String, required: true, trim: true },
    father_name: { type: String, default: '', trim: true },
    identifier_code: { type: String, default: '', trim: true },
    class_or_designation: { type: String, default: '', trim: true },
    custom_text: { type: String, default: 'outstanding performance' },
    resolved_body: { type: String, required: true },
    signatory_title_1: { type: String, default: 'Teacher In-Charge' },
    signatory_title_2: { type: String, default: 'Principal / Head of School' },
    show_stamp: { type: Boolean, default: true },
    show_qr: { type: Boolean, default: true },
    issue_date: { type: Date, default: Date.now },
    issued_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

issuedCertificateSchema.index({ school_id: 1, certificate_no: 1 }, { unique: true });
issuedCertificateSchema.index({ school_id: 1, createdAt: -1 });

module.exports = mongoose.model('IssuedCertificate', issuedCertificateSchema);
