const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectChapter', default: null, index: true },
  question_type: {
    type: String,
    enum: ['MCQ', 'Short', 'Long', 'Fill_Blank', 'True_False'],
    default: 'MCQ',
    required: true
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  question_text: { type: String, required: true, trim: true },
  options: { type: [String], default: [] },
  correct_answer: { type: String, trim: true, default: '' },
  marks: { type: Number, default: 1, min: 1 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

questionBankSchema.index({ school_id: 1, subject_id: 1, question_type: 1 });

module.exports = mongoose.model('QuestionBank', questionBankSchema);
