const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  grade_name: { type: String, default: '' },
  section: { type: String, default: 'A' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  subject_name: { type: String, required: true },
  subject_code: { type: String, default: '' },
  examiner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  examiner_name: { type: String, default: '' },
  exam_date: { type: Date, default: null },
  start_time: { type: String, default: '09:00 AM' },
  end_time: { type: String, default: '12:00 PM' },
  room_no: { type: String, default: 'Hall 1' },
  theory_marks: { type: Number, default: 75, min: 0 },
  practical_marks: { type: Number, default: 25, min: 0 },
  total_marks: { type: Number, default: 100, min: 0 },
  passing_marks: { type: Number, default: 33, min: 0 },
  question_paper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', default: null },
  marks_submitted: { type: Boolean, default: false }
}, { _id: true });

const targetClassSchema = new mongoose.Schema({
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  grade_name: { type: String, default: '' },
  section: { type: String, default: 'A' }
}, { _id: false });

const examSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
  title: { type: String, required: true, trim: true },
  term_type: {
    type: String,
    enum: ['First Term', 'Mid Term', 'Final Term', 'Monthly Test', 'Send-Up', 'Mock Exam'],
    default: 'Mid Term'
  },
  academic_session: { type: String, default: '2026-2027', trim: true },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  grading_policy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GradingPolicy', default: null },
  pass_percentage: { type: Number, default: 33, min: 0, max: 100 },
  target_classes: { type: [targetClassSchema], default: [] },
  papers: { type: [paperSchema], default: [] },
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Marks_Entry', 'Published'],
    default: 'Scheduled'
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

examSchema.index({ school_id: 1, createdAt: -1 });
examSchema.index({ school_id: 1, status: 1 });
examSchema.index({ 'papers.examiner_id': 1 });

module.exports = mongoose.model('Exam', examSchema);
