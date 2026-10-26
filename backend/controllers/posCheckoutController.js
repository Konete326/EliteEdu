const PosSale = require('../models/PosSale');
const StoreSale = require('../models/StoreSale');
const StoreItem = require('../models/StoreItem');
const AccountHead = require('../models/AccountHead');
const AccountTransaction = require('../models/AccountTransaction');
const FeeInvoice = require('../models/FeeInvoice');

const generateReceiptNo = async (schoolId) => {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const count = await PosSale.countDocuments({ school_id: schoolId });
  return `POS-${ym}-${String(count + 1).padStart(4, '0')}`;
};

const handleAccountingSync = async (schoolId, campusId, receiptNo, buyerName, netTotal, paymentMode, userId) => {
  try {
    let incomeHead = await AccountHead.findOne({ school_id: schoolId, name: /Store|Bookshop/i }).select('_id name').lean();
    if (!incomeHead) incomeHead = await AccountHead.findOne({ school_id: schoolId, category: 'Income' }).select('_id name').lean();
    if (!incomeHead) {
      incomeHead = await AccountHead.create({
        school_id: schoolId, campus_id: campusId, name: 'Store & Bookshop Sales',
        code: '4005', category: 'Income', type: 'Credit'
      });
    }
    await AccountTransaction.create({
      school_id: schoolId, campus_id: campusId, voucher_no: `RV-${receiptNo}`,
      voucher_type: 'Income', account_head_id: incomeHead._id, account_head_name: incomeHead.name,
      title: `POS Sale ${receiptNo} - ${buyerName}`, amount: Number(netTotal),
      payment_mode: String(paymentMode).includes('Bank') ? 'Bank Transfer' : 'Cash',
      cost_center: 'Store & POS', reference_no: receiptNo, transaction_date: new Date(),
      approval_status: 'Approved', created_by: userId
    });
  } catch {}
};

const handleFeeChallanSync = async (schoolId, campusId, studentId, receiptNo, netTotal, userId) => {
  try {
    const ym = new Date().toISOString().slice(0, 7);
    let invoice = await FeeInvoice.findOne({
      school_id: schoolId, student_id: studentId, status: { $in: ['Unpaid', 'Partial'] }
    }).sort({ createdAt: -1 });

    if (invoice) {
      invoice.fee_heads.push({ title: `Store Purchase (${receiptNo})`, amount: Number(netTotal) });
      invoice.gross_amount += Number(netTotal);
      invoice.net_payable += Number(netTotal);
      invoice.balance_due += Number(netTotal);
      await invoice.save();
    } else {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 10);
      await FeeInvoice.create({
        school_id: schoolId, campus_id: campusId, challan_no: `CH-STR-${receiptNo}`,
        student_id: studentId, billing_month: `Store-${ym}`, issue_date: new Date(),
        due_date: dueDate, fee_heads: [{ title: `Store Purchase (${receiptNo})`, amount: Number(netTotal) }],
        gross_amount: Number(netTotal), net_payable: Number(netTotal), balance_due: Number(netTotal),
        status: 'Unpaid', collected_by: userId, notes: `Auto-generated from Store POS ${receiptNo}`
      });
    }
  } catch {}
};

const checkout = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
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
    const salePayload = {
      school_id: schoolId, campus_id: campus_id || null, receipt_no, buyer_type,
      student_id: student_id || null, staff_id: staff_id || null, buyer_name, items,
      subtotal: Number(subtotal) || Number(net_total), discount: Number(discount) || 0,
      net_total: Number(net_total), payment_mode, sold_by: req.user?._id || null
    };
    const [sale] = await Promise.all([
      PosSale.create(salePayload),
      StoreSale.create(salePayload).catch(() => null)
    ]);

    if (payment_mode === 'Add_To_Fee_Challan' && student_id) {
      await handleFeeChallanSync(schoolId, campus_id || null, student_id, receipt_no, net_total, req.user?._id || null);
    } else {
      await handleAccountingSync(schoolId, campus_id || null, receipt_no, buyer_name, net_total, payment_mode, req.user?._id || null);
    }
    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkout };
