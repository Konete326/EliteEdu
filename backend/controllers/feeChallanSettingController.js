const FeeChallanSetting = require('../models/FeeChallanSetting');

const getChallanSettings = async (req, res) => {
  try {
    let settings = await FeeChallanSetting.findOne({ school_id: req.schoolId }).lean();
    if (!settings) {
      settings = await FeeChallanSetting.create({
        school_id: req.schoolId,
        bank_name: 'Habib Bank Limited (HBL)',
        branch_name: 'Main Campus Branch',
        account_title: 'Elite Education System',
        account_number: '1234-56789012-03',
        iban: 'PK36HABB0000123456789012'
      });
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateChallanSettings = async (req, res) => {
  try {
    const {
      bank_name, branch_name, account_title, account_number, iban,
      challan_copies, late_fine_policy_note, terms_instructions
    } = req.body;

    const payload = {};
    if (bank_name !== undefined) payload.bank_name = bank_name;
    if (branch_name !== undefined) payload.branch_name = branch_name;
    if (account_title !== undefined) payload.account_title = account_title;
    if (account_number !== undefined) payload.account_number = account_number;
    if (iban !== undefined) payload.iban = iban;
    if (challan_copies !== undefined) payload.challan_copies = challan_copies;
    if (late_fine_policy_note !== undefined) payload.late_fine_policy_note = late_fine_policy_note;
    if (terms_instructions !== undefined) payload.terms_instructions = terms_instructions;

    const settings = await FeeChallanSetting.findOneAndUpdate(
      { school_id: req.schoolId },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Bank challan settings saved', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getChallanSettings, updateChallanSettings };
