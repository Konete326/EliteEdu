const mongoose = require('mongoose');

const admissionLetterTemplateSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    title: { type: String, required: true, trim: true },
    is_default: { type: Boolean, default: false },
    header_office_title: { type: String, default: 'Office of the Principal', trim: true },
    subject_format: {
      type: String,
      default: 'OFFER OF PROVISIONAL ADMISSION INTO {{grade}} ({{session}} ACADEMIC SESSION)',
      trim: true
    },
    opening_text: {
      type: String,
      default: 'With reference to your application for admission into {{school_name}}, I am pleased to inform you that you have been offered provisional admission to pursue an academic programme leading to the completion of {{grade}} (Section {{section}}) in the Department of {{stream}} with effect from the {{session}} Session.'
    },
    fee_due_days: { type: Number, default: 14, min: 1, max: 90 },
    sub_clauses_revocation: {
      type: [String],
      default: [
        'you fail to formally accept this offer by paying the admission & tuition dues of PKR {{fee_amount}} on or before the specified due date.',
        'you are unable to satisfy the necessary criteria for academic admission and verification.',
        'you cannot produce at the time of registration, the original copies of birth certificate / B-Form, previous School Leaving Certificate (SLC), and verified academic credentials.'
      ]
    },
    conditions: {
      type: [String],
      default: [
        'The programme is on Regular / Full-Time basis. The duration of your academic session and other institutional conditions relating to conduct and discipline are as contained in the student handbook and institutional prospectus.',
        'The attached information and challan voucher on fees payable is for your immediate compliance.',
        'If you accept this offer, kindly collect the official admission docket and uniform guidelines from the campus administration office.',
        'Please note that the student’s name and registration number ({{gr_number}}) should be boldly written in the space provided for depositor in the bank teller / challan receipt.',
        'Payment of all admission dues must be made not later than {{due_date}} as this provisional offer of admission will lapse thereafter.',
        'It is mandatory for you to attend the new student induction assembly and orientation programme prior to regular classes. Failure to attend without prior approval may lead to cancellation of admission.',
        'Please note that if it is discovered at any time that you do not possess any of the academic qualifications or submitted fraudulent documents, the admission will be withdrawn immediately.'
      ]
    },
    closing_text: {
      type: String,
      default: 'Please accept our warmest congratulations on behalf of the administration and faculty of the school.'
    },
    signatory_title: { type: String, default: 'For: Admissions & Academic Directorate', trim: true },
    signatory_name: { type: String, default: '', trim: true },
    stripe_primary_color: { type: String, default: '#581c87', trim: true },
    stripe_accent_color: { type: String, default: '#0f766e', trim: true }
  },
  { timestamps: true }
);

admissionLetterTemplateSchema.index({ school_id: 1, is_default: 1 });

module.exports = mongoose.model('AdmissionLetterTemplate', admissionLetterTemplateSchema);
