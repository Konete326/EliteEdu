const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    name: { type: String, required: true, trim: true },
    recipient_type: { type: String, enum: ['Student', 'Staff', 'Both'], default: 'Student' },
    heading: { type: String, required: true, trim: true },
    sub_heading: { type: String, default: 'THIS IS TO CERTIFY THAT', trim: true },
    body_template: { type: String, required: true, trim: true },
    design_style: {
      type: String,
      enum: [
        'academic_gold_hatch',
        'floral_corner_filigree',
        'guilloche_rosette_burgundy',
        'navy_ribbon_halftone',
        'classic_slate_multiborder',
        'royal_gold',
        'emerald_modern',
        'classic_academic',
        'minimal_corporate',
        'ribbon_prestigious'
      ],
      default: 'academic_gold_hatch'
    },
    orientation: {
      type: String,
      enum: ['landscape', 'portrait'],
      default: 'landscape'
    },
    accent_color: { type: String, default: '#b59449' },
    is_default: { type: Boolean, default: false }
  },
  { timestamps: true }
);

certificateTemplateSchema.index({ school_id: 1, name: 1 });

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
