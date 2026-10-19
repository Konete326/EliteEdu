const StaffLoan = require('../models/StaffLoan');

const getLoans = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { staff_id, record_type, status } = req.query;
    const query = { school_id: schoolId };

    if (req.user?.role === 'Teacher') {
      query.staff_id = req.user._id;
    } else if (staff_id) {
      query.staff_id = staff_id;
    }

    if (record_type) query.record_type = record_type;
    if (status) query.status = status;

    const loans = await StaffLoan.find(query).populate('staff_id', 'name email employee_code designation department').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { staff_id, record_type = 'Loan', principal_amount, monthly_installment, remarks, campus_id } = req.body;

    if (!staff_id || !principal_amount || !monthly_installment) {
      return res.status(400).json({ message: 'Staff, principal amount, and monthly installment are required' });
    }

    const pAmount = Number(principal_amount);
    const mInstall = Number(monthly_installment);

    const loan = await StaffLoan.create({
      school_id: schoolId,
      campus_id: campus_id || null,
      staff_id,
      record_type,
      principal_amount: pAmount,
      monthly_installment: mInstall,
      paid_Or_deducted_amount: 0,
      remaining_balance: pAmount,
      status: 'Active',
      remarks: remarks || ''
    });

    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLoanMonthHold = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { month } = req.body;
    if (!month) return res.status(400).json({ message: 'Month string required (YYYY-MM)' });

    const loan = await StaffLoan.findOne({ _id: req.params.id, school_id: schoolId });
    if (!loan) return res.status(404).json({ message: 'Loan record not found' });

    const holds = loan.hold_months || [];
    if (holds.includes(month)) {
      loan.hold_months = holds.filter((m) => m !== month);
    } else {
      loan.hold_months.push(month);
    }

    await loan.save();
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoan = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const loan = await StaffLoan.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: req.body },
      { new: true }
    );
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const loan = await StaffLoan.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ success: true, message: 'Loan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLoans,
  createLoan,
  toggleLoanMonthHold,
  updateLoan,
  deleteLoan
};
