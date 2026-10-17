const FeePayment = require('../models/FeePayment');

const deleteFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findOneAndDelete({ _id: req.params.id, school_id: req.schoolId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }
    res.status(200).json({ success: true, message: 'Fee record successfully voided' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { deleteFeePayment };
