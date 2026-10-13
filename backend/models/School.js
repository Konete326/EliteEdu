const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    school_type: {
      type: String,
      enum: ['Government', 'Private'],
      required: true
    },
    board: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    contact_number: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('School', schoolSchema);
