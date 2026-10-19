const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', default: null },
  question_text: { type: String, required: true, trim: true },
  options: [{ type: String, trim: true }],
  correct_answer: { type: String, trim: true, default: '' },
  marks: { type: Number, default: 1, min: 1 }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Graded', 'Late'], default: 'Pending' },
  obtained_marks: { type: Number, default: null },
  remarks: { type: String, trim: true, default: '' },
  updated_at: { type: Date, default: Date.now }
}, { _id: false });

const lmsItemSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    item_type: {
      type: String,
      enum: ['Course_Topic', 'Homework', 'Lecture_Material', 'Quiz', 'Live_Class'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    section: { type: String, trim: true, default: 'A' },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectChapter', default: null },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    due_date: { type: Date, default: Date.now },
    scheduled_date: { type: Date, default: Date.now },
    start_time: { type: String, default: '09:00 AM', trim: true },
    duration_minutes: { type: Number, default: 45, min: 5 },
    max_marks: { type: Number, default: 10, min: 0 },
    resource_url: { type: String, trim: true, default: '' },
    meeting_room_code: { type: String, trim: true, default: '' },
    key_notes: { type: String, trim: true, default: '' },
    quiz_questions: [quizQuestionSchema],
    submissions: [submissionSchema],
    status: {
      type: String,
      enum: ['Pending', 'In_Progress', 'Active', 'Completed', 'Archived'],
      default: 'Active',
      index: true
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

lmsItemSchema.index({ school_id: 1, item_type: 1, grade_id: 1, subject_id: 1 });
lmsItemSchema.index({ school_id: 1, teacher_id: 1, item_type: 1 });

module.exports = mongoose.model('LmsItem', lmsItemSchema);
