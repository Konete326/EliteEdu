const mongoose = require('mongoose');

const campusTransferLogSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    transfer_no: { type: String, required: true, trim: true, index: true },
    entity_type: { type: String, enum: ['Student', 'Staff'], required: true, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    person_name: { type: String, required: true, trim: true },
    identifier_code: { type: String, default: '', trim: true },
    from_campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    from_campus_name: { type: String, default: '', trim: true },
    to_campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
    to_campus_name: { type: String, default: '', trim: true },
    from_class_or_role: { type: String, default: '', trim: true },
    to_grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    to_section: { type: String, default: 'A', trim: true },
    to_class_or_role: { type: String, default: '', trim: true },
    transfer_date: { type: Date, default: Date.now },
    reason: { type: String, required: true, trim: true },
    transfer_unpaid_dues: { type: Boolean, default: true },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

campusTransferLogSchema.index({ school_id: 1, transfer_date: -1 });

module.exports = mongoose.model('CampusTransferLog', campusTransferLogSchema);
