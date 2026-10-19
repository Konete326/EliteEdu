const mongoose = require('mongoose');

const campusOperationRecordSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    category: {
      type: String,
      enum: ['Complaint', 'Counseling', 'Lost_Found', 'Consent_Letter', 'News_Circular'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal'
    },
    item_location_or_fee: { type: String, trim: true, default: '' },
    event_date: { type: Date, default: Date.now },
    resolution_notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Open', 'In_Review', 'Resolved', 'Claimed', 'Approved'],
      default: 'Open',
      index: true
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

campusOperationRecordSchema.index({ school_id: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('CampusOperationRecord', campusOperationRecordSchema);
