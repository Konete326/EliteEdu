const FeeInvoice = require('../models/FeeInvoice');
const Notification = require('../models/Notification');

const getFeeDefaulters = async (req, res) => {
  try {
    const query = {
      school_id: req.schoolId,
      status: { $in: ['Unpaid', 'Partial', 'Overdue'] },
      balance_due: { $gt: 0 }
    };

    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.grade_id) query.grade_id = req.query.grade_id;
    if (req.query.billing_month) query.billing_month = req.query.billing_month.trim();

    const minArrears = Number(req.query.min_arrears || 0);
    if (minArrears > 0) query.balance_due.$gte = minArrears;

    const invoices = await FeeInvoice.find(query)
      .populate('student_id', 'name gr_number contact_number father_name emergency_contact_no current_grade current_section')
      .populate('grade_id', 'name code')
      .populate('campus_id', 'name code')
      .sort({ balance_due: -1, due_date: 1 })
      .lean();

    const defaultersMap = new Map();
    const now = new Date();

    invoices.forEach((inv) => {
      const sId = String(inv.student_id?._id || inv.student_id);
      if (!defaultersMap.has(sId)) {
        const isPastDue = inv.due_date && new Date(inv.due_date) < now;
        const overdueDays = isPastDue ? Math.floor((now - new Date(inv.due_date)) / (1000 * 60 * 60 * 24)) : 0;
        defaultersMap.set(sId, {
          student: inv.student_id,
          grade: inv.grade_id,
          campus: inv.campus_id,
          section: inv.section,
          total_balance: 0,
          unpaid_invoices_count: 0,
          invoices: [],
          max_overdue_days: overdueDays
        });
      }
      const item = defaultersMap.get(sId);
      item.total_balance += Number(inv.balance_due || 0);
      item.unpaid_invoices_count += 1;
      item.invoices.push({
        _id: inv._id,
        challan_no: inv.challan_no,
        billing_month: inv.billing_month,
        due_date: inv.due_date,
        balance_due: inv.balance_due,
        net_payable: inv.net_payable
      });
    });

    const defaulters = Array.from(defaultersMap.values()).sort((a, b) => b.total_balance - a.total_balance);

    res.status(200).json({ success: true, defaulters, count: defaulters.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendDefaulterAlert = async (req, res) => {
  try {
    const { student_id, message, total_balance } = req.body;
    if (!student_id) return res.status(400).json({ success: false, message: 'Student ID is required' });

    await Notification.create({
      school_id: req.schoolId,
      title: 'Fee Dues Reminder',
      message: message || `Gentle reminder: Outstanding fee balance of PKR ${total_balance || 0} is pending. Please deposit promptly.`,
      target_type: 'Student',
      target_id: student_id,
      priority: 'High',
      created_by: req.user?.id || null
    });

    res.status(200).json({ success: true, message: 'Fee reminder alert dispatched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeDefaulters, sendDefaulterAlert };
