const AccountTransaction = require('../models/AccountTransaction');
const AccountHead = require('../models/AccountHead');
const FeePayment = require('../models/FeePayment');

const getFinancialStatements = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, from_date, to_date } = req.query;

    const txQuery = { school_id: schoolId, approval_status: 'Approved' };
    const feeQuery = { school_id: schoolId, status: { $ne: 'Void' } };

    if (campus_id) {
      txQuery.campus_id = campus_id;
      feeQuery.campus_id = campus_id;
    }
    if (from_date || to_date) {
      txQuery.transaction_date = {};
      feeQuery.payment_date = {};
      if (from_date) {
        txQuery.transaction_date.$gte = new Date(from_date);
        feeQuery.payment_date.$gte = new Date(from_date);
      }
      if (to_date) {
        const end = new Date(to_date);
        end.setHours(23, 59, 59, 999);
        txQuery.transaction_date.$lte = end;
        feeQuery.payment_date.$lte = end;
      }
    }

    const [heads, transactions, feePayments] = await Promise.all([
      AccountHead.find({ school_id: schoolId }).lean(),
      AccountTransaction.find(txQuery).lean(),
      FeePayment.find(feeQuery).lean()
    ]);

    const totalFeeRevenue = feePayments.reduce((acc, p) => acc + Number(p.paid_amount || 0), 0);
    const directIncome = transactions.filter((t) => t.voucher_type === 'Income').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const totalRevenue = totalFeeRevenue + directIncome;

    const totalExpenses = transactions.filter((t) => t.voucher_type === 'Expense').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    const expenseBreakdown = {};
    transactions.filter((t) => t.voucher_type === 'Expense').forEach((t) => {
      const name = t.account_head_name || 'General Expense';
      expenseBreakdown[name] = (expenseBreakdown[name] || 0) + Number(t.amount || 0);
    });

    const incomeBreakdown = { 'Tuition & Admission Fees': totalFeeRevenue };
    transactions.filter((t) => t.voucher_type === 'Income').forEach((t) => {
      const name = t.account_head_name || 'Other Income';
      incomeBreakdown[name] = (incomeBreakdown[name] || 0) + Number(t.amount || 0);
    });

    const cashReceived = feePayments.filter((p) => p.payment_method === 'Cash').reduce((acc, p) => acc + Number(p.paid_amount || 0), 0) +
      transactions.filter((t) => t.voucher_type === 'Income' && t.payment_mode === 'Cash').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const cashSpent = transactions.filter((t) => t.voucher_type === 'Expense' && t.payment_mode === 'Cash').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const cashInHand = Math.max(0, cashReceived - cashSpent);

    const bankReceived = feePayments.filter((p) => p.payment_method !== 'Cash').reduce((acc, p) => acc + Number(p.paid_amount || 0), 0) +
      transactions.filter((t) => t.voucher_type === 'Income' && t.payment_mode !== 'Cash').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const bankSpent = transactions.filter((t) => t.voucher_type === 'Expense' && t.payment_mode !== 'Cash').reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const bankBalance = Math.max(0, bankReceived - bankSpent);

    const totalAssets = cashInHand + bankBalance;
    const balanceSheet = {
      assets: { cashInHand, bankBalance, totalAssets },
      liabilities: { totalLiabilities: 0 },
      equity: { retainedEarnings: netProfit, totalEquity: totalAssets }
    };

    res.status(200).json({
      success: true,
      data: {
        incomeStatement: { totalRevenue, totalExpenses, netProfit, incomeBreakdown, expenseBreakdown, totalFeeRevenue, directIncome },
        cashbook: { cashInHand, bankBalance, totalLiquid: totalAssets },
        balanceSheet,
        headsCount: heads.length,
        vouchersCount: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFinancialStatements };
