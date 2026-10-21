const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    campus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    mandatory: {
      type: Boolean,
      default: true
    },
    subject_type: {
      type: String,
      enum: ['Compulsory', 'Elective'],
      default: 'Compulsory'
    },
    stream: {
      type: String,
      enum: [
        'General',
        'Science (Biology)',
        'Science (Computer)',
        'Pre-Medical',
        'Pre-Engineering',
        'ICS',
        'Commerce',
        'Arts / Humanities'
      ],
      default: 'General'
    },
    elective_group: {
      type: String,
      trim: true,
      default: ''
    },
    assigned_teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    periods_per_week: {
      type: Number,
      default: 5
    },
    theory_marks: {
      type: Number,
      default: 75
    },
    practical_marks: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    },
    classes: {
      type: [{ type: String, trim: true }],
      default: []
    }
  },
  {
    timestamps: true
  }
);

subjectSchema.index({ school_id: 1, campus_id: 1, name: 1 });
subjectSchema.index({ school_id: 1, order: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
