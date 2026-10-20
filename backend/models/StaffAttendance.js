const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  campus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus',
    default: null
  },
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['P', 'A', 'L', 'SL', 'LT', 'Late', 'HD', 'H', 'Hol', 'Off', 'U'],
    default: 'P'
  },
  check_in_time: {
    type: String,
    default: ''
  },
  check_out_time: {
    type: String,
    default: ''
  },
  marked_via: {
    type: String,
    enum: ['Manual', 'Card_Scan'],
    default: 'Manual'
  },
  scan_time: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  },
  marked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

staffAttendanceSchema.index({ school_id: 1, staff_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
