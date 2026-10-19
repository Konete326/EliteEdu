const mongoose = require('mongoose');

const behaviorRecordSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    section: { type: String, default: 'A' },
    academic_session: { type: String, default: '2026-2027', index: true },
    term_name: { type: String, default: 'Mid Term', index: true },
    general_conduct: {
      type: String,
      enum: ['Exemplary', 'Good', 'Satisfactory', 'Needs Improvement'],
      default: 'Good'
    },
    affective_ratings: {
      punctuality: { type: Number, min: 1, max: 5, default: 5 },
      discipline: { type: Number, min: 1, max: 5, default: 5 },
      neatness: { type: Number, min: 1, max: 5, default: 5 },
      obedience: { type: Number, min: 1, max: 5, default: 5 },
      teamwork: { type: Number, min: 1, max: 5, default: 5 },
      honesty: { type: Number, min: 1, max: 5, default: 5 },
      cooperation: { type: Number, min: 1, max: 5, default: 5 }
    },
    psychomotor_ratings: {
      handwriting: { type: Number, min: 1, max: 5, default: 5 },
      communication: { type: Number, min: 1, max: 5, default: 5 },
      sports: { type: Number, min: 1, max: 5, default: 5 },
      sports_games: { type: Number, min: 1, max: 5, default: 5 },
      creativity: { type: Number, min: 1, max: 5, default: 5 },
      creativity_arts: { type: Number, min: 1, max: 5, default: 5 },
      computer_skills: { type: Number, min: 1, max: 5, default: 5 },
      lab_practical: { type: Number, min: 1, max: 5, default: 5 }
    },
    badge_type: {
      type: String,
      enum: ['Merit_Star', 'Good_Conduct', 'Needs_Counseling', 'Disciplinary_Warning'],
      default: 'Good_Conduct'
    },
    points_delta: { type: Number, default: 5 },
    teacher_observation: { type: String, trim: true, default: '' },
    evaluated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

behaviorRecordSchema.index({ school_id: 1, student_id: 1, term_name: 1, academic_session: 1 }, { unique: true });

module.exports = mongoose.model('BehaviorRecord', behaviorRecordSchema);
