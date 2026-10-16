const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    campus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
      index: true
    },
    user_type: {
      type: String,
      enum: ['Student', 'Staff'],
      required: true,
      index: true
    },
    record_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    grade_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grade'
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused', 'Half_Day'],
      default: 'Present'
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ school_id: 1, user_type: 1, date: 1, record_id: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
