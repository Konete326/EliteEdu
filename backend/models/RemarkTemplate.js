const mongoose = require('mongoose');

const remarkTemplateSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true, trim: true },
  text: { type: String, trim: true, default: '' },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

remarkTemplateSchema.index({ school_id: 1, name: 1 });

module.exports = mongoose.model('RemarkTemplate', remarkTemplateSchema);
