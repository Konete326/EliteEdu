const mongoose = require('mongoose');

const remarkPolicySchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  type: { type: String, enum: ['Teacher', 'Principal'], default: 'Teacher', required: true },
  remark: { type: String, required: true, trim: true },
  from_percent: { type: Number, required: true, min: 0, max: 100 },
  to_percent: { type: Number, required: true, min: 0, max: 100 },
  apply_to_all_classes: { type: Boolean, default: true },
  target_grades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grade' }]
}, { timestamps: true });

remarkPolicySchema.index({ school_id: 1, type: 1 });

module.exports = mongoose.model('RemarkPolicy', remarkPolicySchema);
