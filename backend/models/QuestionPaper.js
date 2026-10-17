const mongoose = require('mongoose');

const paperQuestionSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', default: null },
  question_text: { type: String, required: true },
  question_type: { type: String, default: 'MCQ' },
  options: { type: [String], default: [] },
  correct_answer: { type: String, default: '' },
  marks: { type: Number, default: 1 },
  is_compulsory: { type: Boolean, default: true }
}, { _id: true });

const paperSectionSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Section A' },
  instructions: { type: String, default: '' },
  questions: { type: [paperQuestionSchema], default: [] }
}, { _id: true });

const questionPaperSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
  title: { type: String, required: true, trim: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  section: { type: String, default: 'A' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  exam_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamCategory', default: null },
  duration_minutes: { type: Number, default: 120 },
  total_marks: { type: Number, required: true, default: 100 },
  passing_marks: { type: Number, default: 33 },
  instructions: { type: String, default: '' },
  sections: { type: [paperSectionSchema], default: [] },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

questionPaperSchema.index({ school_id: 1, subject_id: 1, grade_id: 1 });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
