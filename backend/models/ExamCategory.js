const mongoose = require('mongoose');

const examCategorySchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

examCategorySchema.index({ school_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('ExamCategory', examCategorySchema);
