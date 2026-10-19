const mongoose = require('mongoose');

const academicPlanEventSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    record_type: {
      type: String,
      enum: ['Lesson_Plan', 'School_Event', 'Holiday', 'PTM'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    start_date: { type: Date, required: true, default: Date.now, index: true },
    end_date: { type: Date, default: Date.now },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section: { type: String, default: 'A', trim: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    learning_objectives: { type: String, trim: true, default: '' },
    teaching_aids: { type: String, trim: true, default: '' },
    target_audience: {
      type: String,
      enum: ['All', 'Teachers', 'Students', 'Specific_Class'],
      default: 'All'
    },
    status: {
      type: String,
      enum: ['Planned', 'In_Progress', 'Completed', 'Cancelled'],
      default: 'Planned'
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

academicPlanEventSchema.index({ school_id: 1, record_type: 1, start_date: -1 });

module.exports = mongoose.model('AcademicPlanEvent', academicPlanEventSchema);
