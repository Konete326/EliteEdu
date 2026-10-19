const mongoose = require('mongoose');

const bellSlotSchema = new mongoose.Schema(
  {
    slot_no: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
    slot_type: { type: String, enum: ['Assembly', 'Period', 'Break'], default: 'Period' },
    period_index: { type: Number, default: null },
    start_time: { type: String, required: true, trim: true },
    end_time: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const bellScheduleSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    school_start_time: { type: String, default: '08:00 AM', trim: true },
    school_end_time: { type: String, default: '02:00 PM', trim: true },
    friday_end_time: { type: String, default: '12:30 PM', trim: true },
    assembly_duration: { type: Number, default: 15, min: 0, max: 60 },
    period_duration: { type: Number, default: 40, min: 20, max: 90 },
    total_periods: { type: Number, default: 7, min: 4, max: 10 },
    break_after_period: { type: Number, default: 4, min: 1, max: 8 },
    break_duration: { type: Number, default: 30, min: 10, max: 60 },
    slots: [bellSlotSchema]
  },
  { timestamps: true }
);

bellScheduleSchema.index({ school_id: 1, campus_id: 1 });

module.exports = mongoose.model('BellSchedule', bellScheduleSchema);
