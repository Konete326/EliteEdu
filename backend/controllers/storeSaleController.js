const StoreSale = require('../models/StoreSale');
const StoreItem = require('../models/StoreItem');
const AccountHead = require('../models/AccountHead');
const AccountTransaction = require('../models/AccountTransaction');

const generateReceiptNo = async (schoolId) => {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const count = await StoreSale.countDocuments({ school_id: schoolId });
  return `POS-${ym}-${String(count + 1).padStart(4, '0')}`;
};

const getSales = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const { buyer_type, search } = req.query;
    const query = { school_id: schoolId };
    if (buyer_type && buyer_type !== 'All') query.buyer_type = buyer_type;
    if (search) {
      query.$or = [{ receipt_no: { $regex: search, $options: 'i' } }, { buyer_name: { $regex: search, $options: 'i' } }];
    }
    const sales = await StoreSale.find(query)
      .populate('student_id', 'name roll_number')
      .populate('staff_id', 'name employee_code')
      .populate('sold_by', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { buyer_type = 'Student', student_id, staff_id, buyer_name, items = [], subtotal, discount = 0, net_total, payment_mode = 'Cash', campus_id } = req.body;
    if (!buyer_name || !items.length || net_total === undefined) {
      return res.status(400).json({ message: 'Buyer name, items, and net total are required' });
    }
    const receipt_no = await generateReceiptNo(schoolId);
    for (const line of items) {
      if (line.item_id) {
        const item = await StoreItem.findOne({ _id: line.item_id, school_id: schoolId });
        if (item) {
          const nextStock = Math.max(0, item.stock_qty - Number(line.qty || 1));
          item.stock_qty = nextStock;
          item.status = nextStock > 0 ? 'Active' : 'Out_Of_Stock';
          await item.save();
        }
      }
    }
    const sale = await StoreSale.create({
      school_id: schoolId,
      campus_id: campus_id || null,
      receipt_no,
      buyer_type,
      student_id: student_id || null,
      staff_id: staff_id || null,
      buyer_name,
      items,
      subtotal: Number(subtotal) || Number(net_total),
      discount: Number(discount) || 0,
      net_total: Number(net_total),
      payment_mode,
      sold_by: req.user?._id || null
    });

    try {
      let incomeHead = await AccountHead.findOne({ school_id: schoolId, code: '4002' }).select('_id name').lean();
      if (!incomeHead) {
        incomeHead = await AccountHead.findOne({ school_id: schoolId, category: 'Income' }).select('_id name').lean();
      }
      if (incomeHead) {
        await AccountTransaction.create({
          school_id: schoolId,
          campus_id: campus_id || null,
          voucher_no: `RV-${receipt_no}`,
          voucher_type: 'Income',
          account_head_id: incomeHead._id,
          account_head_name: incomeHead.name,
          title: `POS Bookstore Sale - ${receipt_no} (${buyer_name})`,
          amount: Number(net_total),
          payment_mode: payment_mode || 'Cash',
          cost_center: 'Bookstore & POS',
          reference_no: receipt_no,
          transaction_date: new Date(),
          approval_status: 'Approved',
          created_by: req.user?._id || null
        });
      }
    } catch {}

    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSales, createSale };
