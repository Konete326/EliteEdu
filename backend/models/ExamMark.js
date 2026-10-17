const mongoose = require('mongoose');

const examMarkSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  section: { type: String, default: 'A' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  theory_obtained: { type: Number, default: 0, min: 0 },
  practical_obtained: { type: Number, default: 0, min: 0 },
  total_obtained: { type: Number, default: 0, min: 0 },
  max_marks: { type: Number, default: 100, min: 1 },
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  grade_letter: { type: String, default: 'F' },
  status: {
    type: String,
    enum: ['PASS', 'FAIL', 'ABSENT'],
    default: 'PASS'
  },
  remarks: { type: String, trim: true, default: '' },
  marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

examMarkSchema.index({ exam_id: 1, grade_id: 1, section: 1, subject_id: 1, student_id: 1 }, { unique: true });
examMarkSchema.index({ school_id: 1, student_id: 1 });
examMarkSchema.index({ exam_id: 1, student_id: 1 });

module.exports = mongoose.model('ExamMark', examMarkSchema);
