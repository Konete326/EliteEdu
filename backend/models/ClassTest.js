const mongoose = require('mongoose');

const testMarkSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  obtained_marks: { type: Number, default: 0, min: 0 },
  is_absent: { type: Boolean, default: false },
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  grade_letter: { type: String, default: 'F', trim: true },
  pass_status: { type: String, enum: ['PASS', 'FAIL', 'ABSENT'], default: 'PASS' },
  remarks: { type: String, trim: true, default: '' }
}, { _id: false });

const classTestSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
  title: { type: String, required: true, trim: true },
  test_date: { type: Date, required: true, default: Date.now, index: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
  section: { type: String, trim: true, default: 'A' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  question_paper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', default: null },
  topic: { type: String, trim: true, default: '' },
  total_marks: { type: Number, required: true, default: 25, min: 1 },
  passing_marks: { type: Number, required: true, default: 8, min: 0 },
  status: { type: String, enum: ['Scheduled', 'Marks_Entered', 'Published'], default: 'Scheduled' },
  marks: { type: [testMarkSchema], default: [] },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

classTestSchema.index({ school_id: 1, grade_id: 1, section: 1, test_date: -1 });
classTestSchema.index({ school_id: 1, subject_id: 1, test_date: -1 });
classTestSchema.index({ school_id: 1, teacher_id: 1 });

module.exports = mongoose.model('ClassTest', classTestSchema);
