const AccountTransaction = require('../models/AccountTransaction');

const generateVoucherNo = async (schoolId, type) => {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const prefix = type === 'Income' ? 'RV' : type === 'Expense' ? 'PV' : 'JV';
  const pattern = `^${prefix}-${ym}-`;

  const latest = await AccountTransaction.findOne({
    school_id: schoolId,
    voucher_no: { $regex: pattern }
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  let nextSeq = 1;
  if (latest?.voucher_no) {
    const parts = latest.voucher_no.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!Number.isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  const candidate = `${prefix}-${ym}-${String(nextSeq).padStart(4, '0')}`;
  const exists = await AccountTransaction.exists({ school_id: schoolId, voucher_no: candidate });
  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${ym}-${randomSuffix}`;
  }
  return candidate;
};

const filterEditableTransactionFields = (body) => {
  const whitelist = [
    'title',
    'amount',
    'transaction_date',
    'payment_mode',
    'reference_no',
    'cost_center',
    'description',
    'attachment_url',
    'account_head_id',
    'account_head_name',
    'voucher_type'
  ];
  const updateData = {};
  whitelist.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });
  if (updateData.amount !== undefined) {
    updateData.amount = Number(updateData.amount) || 0;
  }
  if (updateData.transaction_date) {
    updateData.transaction_date = new Date(updateData.transaction_date);
  }
  return updateData;
};

module.exports = {
  generateVoucherNo,
  filterEditableTransactionFields
};
