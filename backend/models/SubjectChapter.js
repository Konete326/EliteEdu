const mongoose = require('mongoose');

const subjectChapterSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  chapter_no: { type: Number, default: 1 },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

subjectChapterSchema.index({ school_id: 1, grade_id: 1, subject_id: 1, chapter_no: 1 });

module.exports = mongoose.model('SubjectChapter', subjectChapterSchema);
