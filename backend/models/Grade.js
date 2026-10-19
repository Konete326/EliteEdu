const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
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
    sections: {
      type: [{ type: String, trim: true }],
      default: ['A']
    },
    class_teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

gradeSchema.index({ school_id: 1, campus_id: 1, name: 1 });
gradeSchema.index({ school_id: 1, order: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
