const mongoose = require('mongoose');

const customHeadSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 }
}, { _id: false });

const feeStructureSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    academic_session: { type: String, trim: true, default: '2026-2027' },
    tuition_fee: { type: Number, required: true, min: 0 },
    admission_fee: { type: Number, default: 0, min: 0 },
    exam_fee: { type: Number, default: 0, min: 0 },
    computer_lab_fee: { type: Number, default: 0, min: 0 },
    transport_fee: { type: Number, default: 0, min: 0 },
    custom_heads: [customHeadSchema],
    late_fine_amount: { type: Number, default: 200, min: 0 },
    due_day_of_month: { type: Number, default: 10, min: 1, max: 28 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

feeStructureSchema.index({ school_id: 1, grade_id: 1, academic_session: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
