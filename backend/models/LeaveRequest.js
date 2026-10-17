const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    applicant_type: { type: String, enum: ['Student', 'Staff'], required: true, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section: { type: String, default: 'A', trim: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    leave_type: {
      type: String,
      enum: ['Sick Leave', 'Casual Leave', 'Urgent Work', 'Family Event', 'Medical Leave', 'Official Duty', 'Other'],
      default: 'Sick Leave'
    },
    from_date: { type: String, required: true, trim: true },
    to_date: { type: String, required: true, trim: true },
    total_days: { type: Number, required: true, default: 1 },
    reason: { type: String, required: true, trim: true },
    attachment_url: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
    admin_remarks: { type: String, default: '', trim: true },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewed_at: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

leaveRequestSchema.index({ school_id: 1, applicant_type: 1, status: 1 });
leaveRequestSchema.index({ school_id: 1, from_date: 1, to_date: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
