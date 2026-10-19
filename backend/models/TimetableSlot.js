const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    section: { type: String, trim: true, default: 'A' },
    day_of_week: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
      index: true
    },
    period_no: { type: Number, required: true, min: 1, max: 10 },
    start_time: { type: String, required: true, trim: true },
    end_time: { type: String, required: true, trim: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    room_no: { type: String, trim: true, default: 'Room 101' },
    is_break: { type: Boolean, default: false }
  },
  { timestamps: true }
);

timetableSlotSchema.index({ school_id: 1, grade_id: 1, section: 1, day_of_week: 1, period_no: 1 });
timetableSlotSchema.index({ school_id: 1, teacher_id: 1, day_of_week: 1, period_no: 1 });
timetableSlotSchema.index({ school_id: 1, room_no: 1, day_of_week: 1, period_no: 1 });

module.exports = mongoose.model('TimetableSlot', timetableSlotSchema);
