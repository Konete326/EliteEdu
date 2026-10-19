const FeeInvoice = require('../models/FeeInvoice');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const { generateReceiptNo } = require('../utils/feeReceiptHelper');

const collectInvoiceFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_amount, payment_method = 'Cash', transaction_ref = '', notes = '' } = req.body;
    if (paid_amount === undefined || Number(paid_amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const invoice = await FeeInvoice.findOne({ _id: id, school_id: req.schoolId });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const numPaid = Number(paid_amount);
    const totalPaidSoFar = Number(invoice.paid_amount || 0) + numPaid;
    const newBalance = Math.max(0, Number(invoice.net_payable) - totalPaidSoFar);
    const newStatus = newBalance === 0 ? 'Paid' : 'Partial';

    invoice.paid_amount = totalPaidSoFar;
    invoice.balance_due = newBalance;
    invoice.status = newStatus;
    invoice.payment_method = payment_method;
    invoice.payment_date = new Date();
    invoice.transaction_ref = transaction_ref;
    invoice.collected_by = req.user?.id || null;
    invoice.collector_name = req.user?.name || 'Cashier / Admin';
    if (notes) invoice.notes = notes;
    await invoice.save();

    const receiptNo = await generateReceiptNo(req.schoolId);
    const payment = await FeePayment.create({
      school_id: req.schoolId,
      campus_id: invoice.campus_id,
      student_id: invoice.student_id,
      receipt_number: receiptNo,
      challan_number: invoice.challan_no,
      fee_month: invoice.billing_month,
      payment_date: new Date(),
      base_fee: invoice.gross_amount,
      discount: invoice.discount_amount,
      fine: invoice.late_fine || 0,
      other_charges: invoice.arrears_amount || 0,
      net_payable: invoice.net_payable,
      paid_amount: numPaid,
      balance_due: newBalance,
      payment_method,
      reference_number: transaction_ref,
      collected_by: req.user?.id || null,
      collector_name: req.user?.name || 'Cashier / Admin',
      notes,
      status: newStatus
    });

    const populatedInvoice = await FeeInvoice.findById(invoice._id)
      .populate('student_id', 'name gr_number current_section current_grade contact_number father_name')
      .populate('grade_id', 'name code')
      .populate('campus_id', 'name code');

    res.status(200).json({
      success: true,
      message: 'Fee collected and recorded successfully',
      invoice: populatedInvoice,
      payment,
      receipt_number: receiptNo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeeHistory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const query = { school_id: req.schoolId };
    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.fee_month) query.fee_month = req.query.fee_month;
    if (req.query.status) query.status = req.query.status;

    if (req.query.search) {
      const q = req.query.search.trim();
      const matchingStudents = await Student.find({
        school_id: req.schoolId,
        $or: [{ name: { $regex: q, $options: 'i' } }, { gr_number: { $regex: q, $options: 'i' } }]
      }).select('_id');
      query.$or = [{ receipt_number: { $regex: q, $options: 'i' } }, { student_id: { $in: matchingStudents.map((s) => s._id) } }];
    }

    const [payments, total] = await Promise.all([
      FeePayment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('student_id', 'name gr_number current_section current_grade contact_number father_name')
        .populate('campus_id', 'name code')
        .lean(),
      FeePayment.countDocuments(query)
    ]);

    res.status(200).json({ success: true, payments, total, page, totalPages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { collectInvoiceFee, getFeeHistory };
