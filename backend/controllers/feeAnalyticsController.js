const mongoose = require('mongoose');
const FeePayment = require('../models/FeePayment');
const FeeInvoice = require('../models/FeeInvoice');
const Grade = require('../models/Grade');

const getFeeReports = async (req, res) => {
  try {
    const { report_type = 'daily', start_date, end_date, billing_month, campus_id } = req.query;
    const filter = { school_id: req.schoolId };
    if (campus_id) filter.campus_id = campus_id;

    if (report_type === 'daily') {
      const today = new Date();
      const s = start_date ? new Date(start_date) : new Date(today.setHours(0, 0, 0, 0));
      const e = end_date ? new Date(end_date) : new Date(today.setHours(23, 59, 59, 999));
      filter.payment_date = { $gte: s, $lte: e };

      const payments = await FeePayment.find(filter)
        .populate('student_id', 'name gr_number current_section current_grade')
        .populate('campus_id', 'name')
        .sort({ payment_date: -1 })
        .lean();

      const totalAmount = payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
      return res.status(200).json({ success: true, report_type: 'daily', records: payments, total_amount: totalAmount });
    }

    if (report_type === 'recovery_matrix') {
      const month = billing_month || new Date().toISOString().slice(0, 7);
      const schoolObjId = new mongoose.Types.ObjectId(String(req.schoolId));
      const invoiceFilter = {
        school_id: schoolObjId,
        billing_month: month
      };
      if (campus_id && campus_id !== 'all') {
        invoiceFilter.campus_id = new mongoose.Types.ObjectId(String(campus_id));
      }

      const [grades, matrixAgg] = await Promise.all([
        Grade.find({ school_id: schoolObjId }).sort({ order: 1, name: 1 }).lean(),
        FeeInvoice.aggregate([
          { $match: invoiceFilter },
          {
            $group: {
              _id: '$grade_id',
              invoice_count: { $sum: 1 },
              total_billed: { $sum: { $ifNull: ['$net_payable', 0] } },
              total_collected: { $sum: { $ifNull: ['$paid_amount', 0] } },
              balance_outstanding: { $sum: { $ifNull: ['$balance_due', 0] } }
            }
          }
        ])
      ]);

      const matrixMap = new Map();
      matrixAgg.forEach((m) => {
        matrixMap.set(String(m._id || ''), m);
      });

      const gradeStats = grades.map((g) => {
        const stats = matrixMap.get(String(g._id)) || {};
        const totalBilled = stats.total_billed || 0;
        const totalCollected = stats.total_collected || 0;
        const balanceOutstanding = stats.balance_outstanding || 0;
        const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
        return {
          grade_id: g._id,
          grade_name: g.name,
          invoice_count: stats.invoice_count || 0,
          total_billed: totalBilled,
          total_collected: totalCollected,
          balance_outstanding: balanceOutstanding,
          recovery_rate: recoveryRate
        };
      });

      return res.status(200).json({ success: true, report_type: 'recovery_matrix', billing_month: month, matrix: gradeStats });
    }

    if (report_type === 'payment_modes') {
      const payments = await FeePayment.find(filter).select('payment_method paid_amount').lean();
      const modeBreakdown = { Cash: 0, 'Bank Deposit': 0, 'Online Transfer': 0, Cheque: 0 };
      payments.forEach((p) => {
        const m = p.payment_method || 'Cash';
        const key = modeBreakdown[m] !== undefined ? m : 'Cash';
        modeBreakdown[key] += Number(p.paid_amount || 0);
      });
      return res.status(200).json({ success: true, report_type: 'payment_modes', modes: modeBreakdown });
    }

    res.status(400).json({ success: false, message: 'Invalid report type' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeReports };
