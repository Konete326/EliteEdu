const FeeInvoice = require('../models/FeeInvoice');

const generateChallanNo = async (schoolId, billingMonth) => {
  const cleanMonth = String(billingMonth || '').replace(/[^0-9]/g, '').slice(0, 6) ||
    new Date().toISOString().slice(0, 7).replace('-', '');
  const prefix = `CH-${cleanMonth}-`;
  const count = await FeeInvoice.countDocuments({
    school_id: schoolId,
    challan_no: { $regex: `^${prefix}` }
  });
  const seq = String(count + 1).padStart(4, '0');
  const candidate = `${prefix}${seq}`;
  const exists = await FeeInvoice.exists({ school_id: schoolId, challan_no: candidate });
  if (exists) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomSuffix}`;
  }
  return candidate;
};

module.exports = { generateChallanNo };
