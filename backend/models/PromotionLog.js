const mongoose = require('mongoose');

const promotionLogSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    from_grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
    from_grade_name: { type: String, required: true, trim: true },
    to_grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
    to_grade_name: { type: String, required: true, trim: true },
    to_section: { type: String, trim: true, default: 'A' },
    mode: { type: String, enum: ['Manual', 'Auto_Criteria'], default: 'Manual' },
    pass_percentage_used: { type: Number, default: 33 },
    promoted_count: { type: Number, default: 0 },
    retained_count: { type: Number, default: 0 },
    student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    promoted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

promotionLogSchema.index({ school_id: 1, createdAt: -1 });

module.exports = mongoose.model('PromotionLog', promotionLogSchema);
