const mongoose = require('mongoose');

const issuedCertificateSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    certificate_no: { type: String, required: true, index: true },
    template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', default: null },
    template_name: { type: String, required: true, trim: true },
    heading: { type: String, default: '' },
    design_style: { type: String, default: 'royal_gold' },
    accent_color: { type: String, default: '#0d9488' },
    recipient_type: { type: String, enum: ['Student', 'Staff'], required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    recipient_name: { type: String, required: true, trim: true },
    father_name: { type: String, default: '', trim: true },
    identifier_code: { type: String, default: '', trim: true },
    class_or_designation: { type: String, default: '', trim: true },
    custom_text: { type: String, default: 'outstanding performance' },
    resolved_body: { type: String, required: true },
    issue_date: { type: Date, default: Date.now },
    issued_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

issuedCertificateSchema.index({ school_id: 1, certificate_no: 1 }, { unique: true });
issuedCertificateSchema.index({ school_id: 1, createdAt: -1 });

module.exports = mongoose.model('IssuedCertificate', issuedCertificateSchema);
