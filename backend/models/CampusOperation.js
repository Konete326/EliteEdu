const mongoose = require('mongoose');

const campusOperationSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    record_type: {
      type: String,
      enum: ['Campus_Transfer', 'Event', 'News_Feed', 'Complaint', 'Counseling', 'Parental_Consent', 'Lost_Found', 'Academic_Planner'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section: { type: String, default: '' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    event_Or_due_date: { type: Date, default: null },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Open', 'In_Progress', 'Resolved', 'Approved', 'Published'],
      default: 'Open'
    },
    resolution_notes: { type: String, default: '' },
    transfer_details: {
      entity_type: { type: String, enum: ['Student', 'Staff'], default: 'Student' },
      from_campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
      to_campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
      from_grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
      to_grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
      from_section: { type: String, default: '' },
      to_section: { type: String, default: '' },
      effective_date: { type: Date, default: null },
      transfer_order_no: { type: String, default: '' },
      reason: { type: String, default: '' }
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CampusOperation', campusOperationSchema);
