const mongoose = require('mongoose');

const gradingScaleItemSchema = new mongoose.Schema({
  grade: { type: String, required: true, trim: true },
  percent_from: { type: Number, required: true, min: 0, max: 100 },
  percent_upto: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, enum: ['PASS', 'FAIL'], default: 'PASS' },
  remarks: { type: String, trim: true, default: '' }
}, { _id: true });

const policyCardSchema = new mongoose.Schema({
  letter_grade: { type: String, required: true, trim: true },
  from_percent: { type: Number, required: true, min: 0, max: 100 },
  to_percent: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, default: 'Passed' },
  status_color: { type: String, default: '#16A34A' },
  apply_to_all_classes: { type: Boolean, default: true },
  target_grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }]
}, { _id: true });

const failCriteriaSchema = new mongoose.Schema({
  overall_percentage: { type: Number, default: 40, min: 0, max: 100 },
  subject_percentage: { type: Number, default: 33, min: 0, max: 100 },
  min_failed_subjects: { type: Number, default: 1, min: 1 }
}, { _id: false });

const DEFAULT_POLICIES = [
  { letter_grade: 'A+', from_percent: 80, to_percent: 100, status: 'Passed', status_color: '#16A34A', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'A', from_percent: 70, to_percent: 79, status: 'Passed', status_color: '#22C55E', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'B+', from_percent: 60, to_percent: 69, status: 'Passed', status_color: '#3B82F6', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'B', from_percent: 50, to_percent: 59, status: 'Passed', status_color: '#6366F1', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'C', from_percent: 40, to_percent: 49, status: 'Passed', status_color: '#F59E0B', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'D', from_percent: 33, to_percent: 39, status: 'Passed', status_color: '#EAB308', apply_to_all_classes: true, target_grades: [] },
  { letter_grade: 'F', from_percent: 0, to_percent: 32, status: 'Failed', status_color: '#DC2626', apply_to_all_classes: true, target_grades: [] }
];

const DEFAULT_SCALE = DEFAULT_POLICIES.map(p => ({
  grade: p.letter_grade,
  percent_from: p.from_percent,
  percent_upto: p.to_percent,
  status: p.from_percent >= 33 ? 'PASS' : 'FAIL',
  remarks: p.status
}));

const gradingPolicySchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
  policies: {
    type: [policyCardSchema],
    default: () => DEFAULT_POLICIES
  },
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
  DEFAULT_POLICIES,
  DEFAULT_FAIL_CRITERIA: { overall_percentage: 40, subject_percentage: 33, min_failed_subjects: 1 }
};
