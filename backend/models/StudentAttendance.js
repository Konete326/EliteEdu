const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    section: { type: String, trim: true, default: 'A' },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    date: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ['P', 'A', 'L', 'LT', 'HD', 'Hol'],
      default: 'P'
    },
    marked_via: {
      type: String,
      enum: ['Manual', 'Card_Scan'],
      default: 'Manual'
    },
    scan_time: { type: Date, default: Date.now },
    remarks: { type: String, trim: true, default: '' },
    marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

studentAttendanceSchema.index({ school_id: 1, student_id: 1, date: 1 }, { unique: true });
studentAttendanceSchema.index({ school_id: 1, grade_id: 1, section: 1, date: 1 });

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);
