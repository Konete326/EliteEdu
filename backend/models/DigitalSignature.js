const mongoose = require('mongoose');

const digitalSignatureSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Upload', 'Touch_Pad', 'Gallery'],
      default: 'Upload'
    },
    image_url: {
      type: String,
      required: true
    },
    is_default: {
      type: Boolean,
      default: false
    },
    is_stamp: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

digitalSignatureSchema.index({ school_id: 1, is_stamp: 1, is_default: 1 });

module.exports = mongoose.model('DigitalSignature', digitalSignatureSchema);
