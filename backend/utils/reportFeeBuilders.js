const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeePayment = require('../models/FeePayment');
const FeeInvoice = require('../models/FeeInvoice');

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const buildFeeReports = async (schoolId, campusId, { sub_report, grade_id, payment_mode, from_date, to_date }) => {
  const sId = new mongoose.Types.ObjectId(schoolId);
  const qBase = { school_id: sId };
  if (campusId && campusId !== 'all') qBase.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];

  if (sub_report === 'daily_collection_register') {
    const q = { ...qBase };
    if (payment_mode && payment_mode !== 'all') q.payment_method = payment_mode;
    if (from_date || to_date) {
      q.payment_date = {};
      if (from_date) q.payment_date.$gte = new Date(from_date);
      if (to_date) q.payment_date.$lte = new Date(new Date(to_date).setHours(23, 59, 59, 999));
    }
    const payments = await FeePayment.find(q).populate({ path: 'student_id', populate: { path: 'current_grade', select: 'name' } }).sort({ payment_date: -1 }).limit(200).lean();
    const rows = payments.map((p, i) => ({
      sr: i + 1, id: p._id, receipt_number: p.receipt_number || '—', date: fmtDate(p.payment_date),
      gr_number: p.student_id?.gr_number || '—', student_name: p.student_id?.name || '—',
      class_name: p.student_id?.current_grade?.name || '—', fee_month: p.fee_month || '—',
      paid_amount: p.paid_amount || 0, payment_method: p.payment_method || 'Cash', status: p.status || 'Paid'
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'receipt_number', label: 'Receipt #', visible: true },
      { key: 'date', label: 'Date', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'fee_month', label: 'Month', visible: true }, { key: 'paid_amount', label: 'Paid Amount', visible: true },
      { key: 'payment_method', label: 'Mode', visible: true }, { key: 'status', label: 'Status', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'monthly_collection_summary') {
    const rowsAgg = await FeeInvoice.aggregate([
      { $match: qBase },
      {
        $group: {
          _id: '$grade_id',
          billed: { $sum: { $ifNull: ['$net_payable', 0] } },
          collected: { $sum: { $ifNull: ['$paid_amount', 0] } },
          balance: { $sum: { $ifNull: ['$balance_due', 0] } }
        }
      },
      {
        $lookup: {
          from: 'grades',
          localField: '_id',
          foreignField: '_id',
          as: 'grade',
          pipeline: [{ $project: { _id: 1, name: 1 } }]
        }
      },
      { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },
      { $sort: { 'grade.name': 1 } }
    ]);
    const rows = rowsAgg.map((s, i) => {
      const className = s.grade?.name || 'Unassigned';
      const billed = Number(s.billed) || 0;
      const collected = Number(s.collected) || 0;
      const balance = Number(s.balance) || 0;
      return {
        sr: i + 1,
        id: `sum-${i + 1}`,
        class_name: className,
        billed,
        collected,
        balance,
        rate: billed > 0 ? `${Math.round((collected / billed) * 100)}%` : '0%'
      };
    });
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'billed', label: 'Total Billed', visible: true }, { key: 'collected', label: 'Total Collected', visible: true },
      { key: 'balance', label: 'Pending Balance', visible: true }, { key: 'rate', label: 'Collection %', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'concession_scholarship_report') {
    const sq = { ...qBase, discount: { $gt: 0 } };
    if (grade_id && grade_id !== 'all') sq.current_grade = new mongoose.Types.ObjectId(grade_id);
    const students = await Student.find(sq).populate('current_grade', 'name').lean();
    const rows = students.map((s, i) => ({
      sr: i + 1, id: s._id, gr_number: s.gr_number || '—', student_name: s.name,
      class_name: s.current_grade?.name || 'Class', monthly_fee: Number(s.monthly_fee) || 0,
      discount: Number(s.discount) || 0, net_fee: Math.max(0, (Number(s.monthly_fee) || 0) - (Number(s.discount) || 0)),
      reason: s.discount_reference || 'Concession'
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'monthly_fee', label: 'Base Fee', visible: true }, { key: 'discount', label: 'Discount', visible: true },
      { key: 'net_fee', label: 'Net Payable', visible: true }, { key: 'reason', label: 'Reason', visible: true }
    ];
    return { columns, rows };
  }

  const pList = await FeePayment.find(qBase).populate({ path: 'student_id', populate: { path: 'current_grade', select: 'name' } }).sort({ createdAt: -1 }).limit(100).lean();
  const rows = pList.map((p, i) => ({
    sr: i + 1, id: p._id, gr_number: p.student_id?.gr_number || '—', student_name: p.student_id?.name || '—',
    class_name: p.student_id?.current_grade?.name || '—', month: p.fee_month, payable: p.net_payable,
    paid: p.paid_amount, balance: p.balance_due, status: p.status || 'Paid'
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'month', label: 'Month', visible: true }, { key: 'payable', label: 'Payable', visible: true },
    { key: 'paid', label: 'Paid', visible: true }, { key: 'balance', label: 'Balance', visible: true },
    { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildFeeReports };
