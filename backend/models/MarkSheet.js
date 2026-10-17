const mongoose = require('mongoose');

const markSheetEntrySchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  obtained_marks: { type: Number, default: 0, min: 0 },
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  grade: { type: String, default: 'F' },
  status_color: { type: String, default: '#DC2626' },
  is_absent: { type: Boolean, default: false },
  teacher_remarks: { type: String, default: '' },
  principal_remarks: { type: String, default: '' }
}, { _id: true });

const markSheetSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', default: null, index: true },
  exam_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory', default: null },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  section: { type: String, default: 'A' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examiner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  exam_date: { type: Date, default: Date.now },
  max_marks: { type: Number, default: 100, min: 1 },
  passing_marks: { type: Number, default: 33, min: 0 },
  status: { type: String, enum: ['Draft', 'Submitted', 'Locked'], default: 'Draft' },
  question_paper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', default: null },
  results_locked: { type: Boolean, default: false },
  marks: { type: [markSheetEntrySchema], default: [] },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

markSheetSchema.index({ school_id: 1, grade_id: 1, subject_id: 1, exam_date: -1 });

module.exports = mongoose.model('MarkSheet', markSheetSchema);
