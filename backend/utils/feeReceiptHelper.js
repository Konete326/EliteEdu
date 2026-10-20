const FeePayment = require('../models/FeePayment');

const generateReceiptNo = async (schoolId) => {
  const yearMonth = new Date().toISOString().slice(2, 7).replace('-', '');
  const prefix = `REC-${yearMonth}-`;

  const latest = await FeePayment.findOne({
    school_id: schoolId,
    receipt_no: { $regex: `^${prefix}` }
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  let nextSeq = 1;
  if (latest?.receipt_no) {
    const parts = latest.receipt_no.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!Number.isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  const seq = String(nextSeq).padStart(4, '0');
  const candidate = `${prefix}${seq}`;
  const exists = await FeePayment.exists({ school_id: schoolId, receipt_no: candidate });
  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomSuffix}`;
  }
  return candidate;
};

module.exports = { generateReceiptNo };
