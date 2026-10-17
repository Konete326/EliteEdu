const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const { generateReceiptNo } = require('../utils/feeReceiptHelper');

const collectFee = async (req, res) => {
  try {
    const { student_id, fee_month, base_fee, discount = 0, fine = 0, other_charges = 0, paid_amount, payment_method = 'Cash', reference_number = '', notes = '' } = req.body;
    if (!student_id || !fee_month || paid_amount === undefined) {
      return res.status(400).json({ success: false, message: 'Student, fee month, and paid amount are required' });
    }

    const student = await Student.findOne({ _id: student_id, school_id: req.schoolId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found in your institution' });
    }

    const numBase = Number(base_fee !== undefined ? base_fee : student.monthly_fee || 0);
    const numDiscount = Number(discount);
    const numFine = Number(fine);
    const numOther = Number(other_charges);
    const numPaid = Number(paid_amount);

    const netPayable = Math.max(0, numBase - numDiscount + numFine + numOther);
    const balanceDue = Math.max(0, netPayable - numPaid);
    const status = balanceDue === 0 ? 'Paid' : numPaid > 0 ? 'Partial' : 'Unpaid';
    const receiptNo = await generateReceiptNo(req.schoolId);

    const payment = await FeePayment.create({
      school_id: req.schoolId,
      campus_id: student.campus_id || req.body.campus_id || null,
      student_id: student._id,
      receipt_number: receiptNo,
      fee_month: fee_month.trim(),
      base_fee: numBase,
      discount: numDiscount,
      fine: numFine,
      other_charges: numOther,
      net_payable: netPayable,
      paid_amount: numPaid,
      balance_due: balanceDue,
      payment_method,
      reference_number,
      collected_by: req.user?.id || null,
      collector_name: req.user?.name || 'Authorized Staff',
      notes,
      status
    });

    const populated = await FeePayment.findById(payment._id)
      .populate('student_id', 'name gr_number current_section current_grade contact_number father_name')
      .populate('campus_id', 'name code');

    res.status(201).json({ success: true, message: 'Fee payment collected successfully', payment: populated });
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
        $or: [{ name: { $regex: q, $options: 'i' } }, { gr_number: { $regex: q, $options: 'i' } }, { father_name: { $regex: q, $options: 'i' } }]
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

module.exports = { collectFee, getFeeHistory };
