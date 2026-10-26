const StaffSalarySlip = require('../models/StaffSalarySlip');
const User = require('../models/User');
const StaffAttendance = require('../models/StaffAttendance');
const StaffLoan = require('../models/StaffLoan');

const generateMonthPayroll = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { salary_month, campus_id } = req.body;
    if (!salary_month) return res.status(400).json({ message: 'salary_month is required (YYYY-MM)' });

    const staffQuery = { school_id: schoolId, role: { $in: ['Teacher', 'Admin'] }, status: 'Active' };
    if (campus_id) staffQuery.campus_id = campus_id;

    const staffList = await User.find(staffQuery).select('basic_salary payroll_config employee_code campus_id').lean();
    const generated = [];

    for (const staff of staffList) {
      const basic = Number(staff.basic_salary) || Number(staff.payroll_config?.basic_salary) || 30000;
      const hAllowance = Number(staff.payroll_config?.house_rent_allowance) || 0;
      const mAllowance = Number(staff.payroll_config?.medical_allowance) || 0;
      const cAllowance = Number(staff.payroll_config?.conveyance_allowance) || 0;
      const bonus = Number(staff.payroll_config?.bonus_or_encashment) || 0;

      const attList = await StaffAttendance.find({
        school_id: schoolId,
        staff_id: staff._id,
        date: { $regex: `^${salary_month}` }
      }).select('status').lean();

      const pDays = attList.filter((a) => a.status === 'P').length || 26;
      const aDays = attList.filter((a) => a.status === 'A').length;
      const lDays = attList.filter((a) => a.status === 'L').length;
      const ltCount = attList.filter((a) => a.status === 'LT').length;

      const perDay = basic / 30;
      const absentDeduction = Math.round(aDays * perDay);

      const activeLoans = await StaffLoan.find({
        school_id: schoolId,
        staff_id: staff._id,
        status: 'Active',
        record_type: { $in: ['Loan', 'Advance_Salary'] },
        hold_months: { $ne: salary_month }
      }).select('monthly_installment remaining_balance').lean();
      const loanDed = activeLoans.reduce((acc, l) => acc + Math.min(l.monthly_installment, l.remaining_balance), 0);

      const activeDeposits = await StaffLoan.find({
        school_id: schoolId,
        staff_id: staff._id,
        status: 'Active',
        record_type: 'Security_Deposit',
        hold_months: { $ne: salary_month }
      }).select('monthly_installment remaining_balance').lean();
      const depositDed = activeDeposits.reduce((acc, s) => acc + Math.min(s.monthly_installment, s.remaining_balance), 0);

      const gross = basic + hAllowance + mAllowance + cAllowance + bonus;
      const totDeductions = absentDeduction + loanDed + depositDed;
      const net = Math.max(0, gross - totDeductions);

      const slipNo = `SAL-${salary_month.replace('-', '')}-${String(staff.employee_code || staff._id).slice(-4).toUpperCase()}`;

      const slip = await StaffSalarySlip.findOneAndUpdate(
        { school_id: schoolId, salary_month, staff_id: staff._id },
        {
          $set: {
            campus_id: staff.campus_id || campus_id || null,
            slip_no: slipNo,
            basic_salary: basic,
            house_rent_allowance: hAllowance,
            medical_allowance: mAllowance,
            conveyance_allowance: cAllowance,
            bonus_or_encashment: bonus,
            present_days: pDays,
            absent_days: aDays,
            leave_days: lDays,
            late_count: ltCount,
            absent_deduction: absentDeduction,
            loan_deduction: loanDed,
            security_deposit_deduction: depositDed,
            gross_salary: gross,
            total_deductions: totDeductions,
            net_payable: net,
            status: 'Draft'
          }
        },
        { upsert: true, new: true, lean: true }
      );
      generated.push(slip);
    }

    res.status(200).json({ success: true, count: generated.length, data: generated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateMonthPayroll };
