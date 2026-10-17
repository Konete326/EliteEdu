const FeePayment = require('../models/FeePayment');

const generateReceiptNo = async (schoolId) => {
  const count = await FeePayment.countDocuments({ school_id: schoolId });
  const yearMonth = new Date().toISOString().slice(2, 7).replace('-', '');
  return `REC-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
};

module.exports = { generateReceiptNo };
