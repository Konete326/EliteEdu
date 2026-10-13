const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'Teacher'],
      required: true
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
      validate: {
        validator: function (val) {
          if (this.role === 'SuperAdmin') {
            return val === null || val === undefined;
          }
          return mongoose.Types.ObjectId.isValid(val);
        },
        message: 'School reference required for non-SuperAdmin users'
      }
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

module.exports = mongoose.model('User', userSchema);
