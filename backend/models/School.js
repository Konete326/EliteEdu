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
    logo_url: {
      type: String,
      trim: true,
      default: ''
    },
    slogan: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    affiliation_number: {
      type: String,
      trim: true,
      default: ''
    },
    established_year: {
      type: String,
      trim: true,
      default: ''
    },
    principal_name: {
      type: String,
      trim: true,
      default: ''
    },
    principal_signature_url: {
      type: String,
      trim: true,
      default: ''
    },
    currency: {
      type: String,
      trim: true,
      default: 'PKR'
    },
    is_active: {
      type: Boolean,
      default: true
    },
    theme_settings: {
      mode: { type: String, enum: ['light', 'dark'], default: 'light' },
      placement: { type: String, enum: ['ltr', 'rtl'], default: 'ltr' },
      sidebarBg: { type: String, default: 'white' },
      headerBg: { type: String, default: 'white' },
      activeColor: { type: String, default: '#0d9488' },
      language: { type: String, default: 'English' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('School', schoolSchema);
