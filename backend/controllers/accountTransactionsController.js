const AccountTransaction = require('../models/AccountTransaction');
const AccountHead = require('../models/AccountHead');
const Notification = require('../models/Notification');

const generateVoucherNo = async (schoolId, type) => {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const prefix = type === 'Income' ? 'RV' : type === 'Expense' ? 'PV' : 'JV';
  const count = await AccountTransaction.countDocuments({ school_id: schoolId });
  return `${prefix}-${ym}-${String(count + 1).padStart(4, '0')}`;
};

const getTransactions = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { voucher_type, campus_id, account_head_id, from_date, to_date, approval_status, search } = req.query;
    const query = { school_id: schoolId };

    if (voucher_type) query.voucher_type = voucher_type;
    if (campus_id) query.campus_id = campus_id;
    if (account_head_id) query.account_head_id = account_head_id;
    if (approval_status) query.approval_status = approval_status;
    if (from_date || to_date) {
      query.transaction_date = {};
      if (from_date) query.transaction_date.$gte = new Date(from_date);
      if (to_date) {
        const end = new Date(to_date);
        end.setHours(23, 59, 59, 999);
        query.transaction_date.$lte = end;
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { voucher_no: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const txs = await AccountTransaction.find(query).sort({ transaction_date: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: txs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { voucher_type, account_head_id, title, amount, payment_mode, cost_center, description, reference_no, attachment_url, campus_id, transaction_date } = req.body;

    if (!voucher_type || !account_head_id || !title || amount === undefined) {
      return res.status(400).json({ message: 'Missing required voucher fields' });
    }

    const head = await AccountHead.findOne({ _id: account_head_id, school_id: schoolId });
    if (!head) return res.status(404).json({ message: 'Account head not found' });

    const voucher_no = req.body.voucher_no || await generateVoucherNo(schoolId, voucher_type);

    const tx = await AccountTransaction.create({
      school_id: schoolId,
      campus_id: campus_id || null,
      voucher_no,
      voucher_type,
      account_head_id,
      account_head_name: head.name,
      title: String(title).trim(),
      amount: Number(amount) || 0,
      payment_mode: payment_mode || 'Cash',
      cost_center: cost_center || 'Main Campus',
      description: description || '',
      reference_no: reference_no || '',
      attachment_url: attachment_url || '',
      approval_status: req.body.approval_status || 'Approved',
      transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
      created_by: req.user?._id
    });

    res.status(201).json({ success: true, data: tx });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const tx = await AccountTransaction.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: req.body },
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ success: true, data: tx });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const tx = await AccountTransaction.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { approval_status } = req.body;
    const tx = await AccountTransaction.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: { approval_status } },
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ success: true, data: tx });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionStatus
};
