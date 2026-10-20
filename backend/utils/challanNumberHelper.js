const FeeInvoice = require('../models/FeeInvoice');

const generateChallanNo = async (schoolId, billingMonth) => {
  const cleanMonth = String(billingMonth || '').replace(/[^0-9]/g, '').slice(0, 6) ||
    new Date().toISOString().slice(0, 7).replace('-', '');
  const prefix = `CH-${cleanMonth}-`;

  const latest = await FeeInvoice.findOne({
    school_id: schoolId,
    challan_no: { $regex: `^${prefix}` }
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  let nextSeq = 1;
  if (latest?.challan_no) {
    const parts = latest.challan_no.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!Number.isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  const seq = String(nextSeq).padStart(4, '0');
  const candidate = `${prefix}${seq}`;
  const exists = await FeeInvoice.exists({ school_id: schoolId, challan_no: candidate });
  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomSuffix}`;
  }
  return candidate;
};

module.exports = { generateChallanNo };
