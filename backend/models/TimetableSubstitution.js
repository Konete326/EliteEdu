const mongoose = require('mongoose');

const timetableSubstitutionSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    date: { type: String, required: true, index: true },
    timetable_slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimetableSlot', required: true, index: true },
    period_no: { type: Number, required: true },
    day_of_week: { type: String, required: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
    section: { type: String, default: 'A' },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    original_teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    substitute_teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['Assigned', 'Completed', 'Cancelled'], default: 'Assigned' },
    remarks: { type: String, default: '', trim: true },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

timetableSubstitutionSchema.index({ school_id: 1, date: 1, timetable_slot_id: 1 });
timetableSubstitutionSchema.index({ school_id: 1, date: 1, substitute_teacher_id: 1 });

module.exports = mongoose.model('TimetableSubstitution', timetableSubstitutionSchema);
