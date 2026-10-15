const mongoose = require('mongoose');

const gradingScaleItemSchema = new mongoose.Schema({
  grade: { type: String, required: true, trim: true },
  percent_from: { type: Number, required: true, min: 0, max: 100 },
  percent_upto: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, enum: ['PASS', 'FAIL'], default: 'PASS' },
  remarks: { type: String, trim: true, default: '' }
}, { _id: true });

const failCriteriaSchema = new mongoose.Schema({
  overall_percentage: { type: Number, default: 40, min: 0, max: 100 },
  subject_percentage: { type: Number, default: 33, min: 0, max: 100 },
  min_failed_subjects: { type: Number, default: 1, min: 1 }
}, { _id: false });

const DEFAULT_SCALE = [
  { grade: 'A+', percent_from: 80, percent_upto: 100, status: 'PASS', remarks: 'Outstanding' },
  { grade: 'A', percent_from: 70, percent_upto: 79, status: 'PASS', remarks: 'Excellent' },
  { grade: 'B+', percent_from: 60, percent_upto: 69, status: 'PASS', remarks: 'Very Good' },
  { grade: 'B', percent_from: 50, percent_upto: 59, status: 'PASS', remarks: 'Good' },
  { grade: 'C', percent_from: 40, percent_upto: 49, status: 'PASS', remarks: 'Fair' },
  { grade: 'D', percent_from: 33, percent_upto: 39, status: 'PASS', remarks: 'Satisfactory' },
  { grade: 'F', percent_from: 0, percent_upto: 32, status: 'FAIL', remarks: 'Needs Improvement' }
];

const gradingPolicySchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
  grading_scale: {
    type: [gradingScaleItemSchema],
    default: () => DEFAULT_SCALE
  },
  fail_criteria: {
    type: failCriteriaSchema,
    default: () => ({ overall_percentage: 40, subject_percentage: 33, min_failed_subjects: 1 })
  }
}, { timestamps: true });

gradingPolicySchema.index({ school_id: 1, campus_id: 1 });

module.exports = {
  GradingPolicy: mongoose.model('GradingPolicy', gradingPolicySchema),
  DEFAULT_SCALE,
  DEFAULT_FAIL_CRITERIA: { overall_percentage: 40, subject_percentage: 33, min_failed_subjects: 1 }
};
