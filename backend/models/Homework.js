const mongoose = require('mongoose');

const homeworkAttachmentSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  file_url: { type: String, trim: true, default: '' },
  file_name: { type: String, trim: true, default: '' }
}, { _id: false });

const homeworkSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    section: { type: String, trim: true, default: '' },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    due_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Assigned', 'Unassigned'],
      default: 'Assigned'
    },
    is_published: { type: Boolean, default: true },
    attachments: [homeworkAttachmentSchema]
  },
  { timestamps: true }
);

homeworkSchema.index({ school_id: 1, campus_id: 1, status: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);
