const mongoose = require('mongoose');

const feeChallanSettingSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, unique: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    bank_name: { type: String, trim: true, default: 'Habib Bank Limited (HBL)' },
    branch_name: { type: String, trim: true, default: 'Main Campus Branch' },
    account_title: { type: String, trim: true, default: 'Elite Education System' },
    account_number: { type: String, trim: true, default: '1234-56789012-03' },
    iban: { type: String, trim: true, default: 'PK36HABB0000123456789012' },
    challan_copies: {
      type: [String],
      default: ['Bank Copy', 'Institute Copy', 'Student Copy']
    },
    late_fine_policy_note: {
      type: String,
      trim: true,
      default: 'Payment received after due date will incur late fee surcharge.'
    },
    terms_instructions: {
      type: [String],
      default: [
        'Payment can be deposited at any branch nationwide before the due date.',
        'Cheques and online transfers must specify Challan No in the transaction reference.',
        'Dues once paid are non-refundable and non-transferable.',
        'Please retain student copy with bank teller stamp for proof of payment.'
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeChallanSetting', feeChallanSettingSchema);
