const StaffSalarySlip = require('../models/StaffSalarySlip');
const StaffLoan = require('../models/StaffLoan');
const AccountHead = require('../models/AccountHead');
const AccountTransaction = require('../models/AccountTransaction');
const Notification = require('../models/Notification');

const paySalarySlip = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { payment_mode = 'Bank Transfer' } = req.body;
    const slip = await StaffSalarySlip.findOne({ _id: req.params.id, school_id: schoolId }).populate('staff_id');
    if (!slip) return res.status(404).json({ message: 'Salary slip not found' });

    slip.status = 'Paid';
    slip.payment_date = new Date();
    slip.payment_mode = payment_mode;
    await slip.save();

    if (slip.loan_deduction > 0) {
      const loan = await StaffLoan.findOne({ school_id: schoolId, staff_id: slip.staff_id._id, status: 'Active', record_type: { $in: ['Loan', 'Advance_Salary'] } });
      if (loan) {
        loan.paid_Or_deducted_amount += slip.loan_deduction;
        loan.remaining_balance = Math.max(0, loan.principal_amount - loan.paid_Or_deducted_amount);
        if (loan.remaining_balance <= 0) loan.status = 'Completed';
        await loan.save();
      }
    }

    let head = await AccountHead.findOne({ school_id: schoolId, category: 'Expense', name: { $regex: /Salaries/i } }).select('_id name').lean();
    if (!head) head = await AccountHead.findOne({ school_id: schoolId, category: 'Expense' }).select('_id name').lean();

    if (head) {
      await AccountTransaction.create({
        school_id: schoolId,
        campus_id: slip.campus_id || null,
        voucher_no: `PV-${Date.now().toString().slice(-6)}`,
        voucher_type: 'Expense',
        account_head_id: head._id,
        account_head_name: head.name,
        title: `Salary Disbursed - ${slip.staff_id?.name || 'Staff'} (${slip.salary_month})`,
        amount: slip.net_payable,
        payment_mode,
        cost_center: 'Main Campus',
        description: `Net salary for ${slip.salary_month} slip ${slip.slip_no}`,
        approval_status: 'Approved',
        transaction_date: new Date(),
        created_by: req.user?._id
      });
    }

    await Notification.create({
      school_id: schoolId,
      campus_id: slip.campus_id || null,
      title: 'Salary Disbursed',
      message: `Your salary for ${slip.salary_month} of Rs. ${slip.net_payable.toLocaleString()} has been paid via ${payment_mode}.`,
      type: 'System',
      priority: 'Important',
      target_audience: 'Specific_User',
      target_user_id: slip.staff_id?._id,
      created_by: req.user?._id
    });

    res.status(200).json({ success: true, data: slip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { paySalarySlip };
