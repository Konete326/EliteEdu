const AccountHead = require('../models/AccountHead');
const AccountTransaction = require('../models/AccountTransaction');

const DEFAULT_HEADS = [
  { code: '1001', name: 'Cash in Hand', category: 'Asset' },
  { code: '1002', name: 'School Bank Account', category: 'Asset' },
  { code: '1003', name: 'Staff Loans Receivable', category: 'Asset' },
  { code: '2001', name: 'Staff Security Deposits Payable', category: 'Liability' },
  { code: '3001', name: 'School Capital & Equity', category: 'Equity' },
  { code: '4001', name: 'Tuition & Admission Fees', category: 'Income' },
  { code: '4002', name: 'Bookstore & Uniform Sales', category: 'Income' },
  { code: '4003', name: 'Transport Income', category: 'Income' },
  { code: '5001', name: 'Staff Salaries & Allowances', category: 'Expense' },
  { code: '5002', name: 'KE / Electricity & Gas Bills', category: 'Expense' },
  { code: '5003', name: 'Building Rent & Maintenance', category: 'Expense' },
  { code: '5004', name: 'Lab & Computer Consumables', category: 'Expense' },
  { code: '5005', name: 'Stationery & Exam Printing', category: 'Expense' },
  { code: '5006', name: 'Marketing & Ads', category: 'Expense' }
];

const getAccountHeads = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });

    const count = await AccountHead.countDocuments({ school_id: schoolId });
    if (count === 0) {
      const seeds = DEFAULT_HEADS.map((h) => ({ ...h, school_id: schoolId, opening_balance: 0, status: 'Active' }));
      await AccountHead.insertMany(seeds);
    }

    const heads = await AccountHead.find({ school_id: schoolId }).sort({ code: 1 });
    res.status(200).json({ success: true, data: heads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAccountHead = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { code, name, category, opening_balance = 0, status = 'Active' } = req.body;
    if (!code || !name || !category) {
      return res.status(400).json({ message: 'Code, name, and category are required' });
    }

    const existing = await AccountHead.findOne({ school_id: schoolId, code: String(code).trim() });
    if (existing) return res.status(400).json({ message: 'Account code already exists' });

    const head = await AccountHead.create({
      school_id: schoolId,
      code: String(code).trim(),
      name: String(name).trim(),
      category,
      opening_balance: Number(opening_balance) || 0,
      status
    });

    res.status(201).json({ success: true, data: head });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAccountHead = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const head = await AccountHead.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: req.body },
      { new: true }
    );
    if (!head) return res.status(404).json({ message: 'Account head not found' });
    res.status(200).json({ success: true, data: head });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccountHead = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const inUse = await AccountTransaction.countDocuments({ school_id: schoolId, account_head_id: req.params.id });
    if (inUse > 0) {
      return res.status(400).json({ message: 'Cannot delete account head with associated transactions' });
    }
    const head = await AccountHead.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!head) return res.status(404).json({ message: 'Account head not found' });
    res.status(200).json({ success: true, message: 'Account head deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAccountHeads,
  createAccountHead,
  updateAccountHead,
  deleteAccountHead
};
