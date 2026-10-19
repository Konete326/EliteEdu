const mongoose = require('mongoose');
const AccountHead = require('../models/AccountHead');
const AccountTransaction = require('../models/AccountTransaction');
const StaffSalarySlip = require('../models/StaffSalarySlip');

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const buildAccountsReports = async (schoolId, campusId, { sub_report, from_date, to_date }) => {
  const sId = new mongoose.Types.ObjectId(schoolId);
  const qBase = { school_id: sId };
  if (campusId && campusId !== 'all') qBase.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];

  if (sub_report === 'income_register' || sub_report === 'expense_register') {
    const isInc = sub_report === 'income_register';
    const q = { ...qBase, voucher_type: isInc ? 'Income' : 'Expense' };
    if (from_date || to_date) {
      q.transaction_date = {};
      if (from_date) q.transaction_date.$gte = new Date(from_date);
      if (to_date) q.transaction_date.$lte = new Date(new Date(to_date).setHours(23, 59, 59, 999));
    }
    const txs = await AccountTransaction.find(q).sort({ transaction_date: -1 }).limit(200).lean();
    const rows = txs.map((t, i) => ({
      sr: i + 1, id: t._id, voucher_no: t.voucher_no || '—', date: fmtDate(t.transaction_date),
      head: t.account_head_name || (isInc ? 'Income' : 'Expense'), title: t.title, mode: t.payment_mode || 'Cash', amount: t.amount || 0
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'voucher_no', label: 'Voucher #', visible: true },
      { key: 'date', label: 'Date', visible: true }, { key: 'head', label: 'Account Head', visible: true },
      { key: 'title', label: isInc ? 'Particulars' : 'Expense Title', visible: true }, { key: 'mode', label: 'Mode', visible: true },
      { key: 'amount', label: 'Amount (PKR)', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'day_book_cashbook') {
    const txs = await AccountTransaction.find(qBase).sort({ transaction_date: 1 }).limit(250).lean();
    let running = 0;
    const rows = txs.map((t, i) => {
      const isInc = t.voucher_type === 'Income';
      const debit = isInc ? t.amount : 0;
      const credit = !isInc ? t.amount : 0;
      running += debit - credit;
      return {
        sr: i + 1, id: t._id, date: fmtDate(t.transaction_date), voucher_no: t.voucher_no || '—',
        title: t.title, debit, credit, balance: running
      };
    });
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'date', label: 'Date', visible: true },
      { key: 'voucher_no', label: 'Voucher #', visible: true }, { key: 'title', label: 'Particulars', visible: true },
      { key: 'debit', label: 'Debit (In)', visible: true }, { key: 'credit', label: 'Credit (Out)', visible: true },
      { key: 'balance', label: 'Running Balance', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'trial_balance_summary') {
    const heads = await AccountHead.find({ school_id: sId }).lean();
    const txs = await AccountTransaction.find(qBase).lean();
    const rows = heads.map((h, i) => {
      const rel = txs.filter((t) => String(t.account_head_id) === String(h._id));
      const debit = rel.filter((t) => t.voucher_type === 'Income').reduce((s, c) => s + (c.amount || 0), 0);
      const credit = rel.filter((t) => t.voucher_type === 'Expense').reduce((s, c) => s + (c.amount || 0), 0);
      return { sr: i + 1, id: h._id, code: h.code || '—', name: h.name, category: h.category, debit, credit, balance: debit - credit };
    });
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'code', label: 'Code', visible: true },
      { key: 'name', label: 'Account Head', visible: true }, { key: 'category', label: 'Category', visible: true },
      { key: 'debit', label: 'Total Debit', visible: true }, { key: 'credit', label: 'Total Credit', visible: true },
      { key: 'balance', label: 'Net Balance', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'profit_and_loss_statement') {
    const txs = await AccountTransaction.find(qBase).lean();
    const totalInc = txs.filter((t) => t.voucher_type === 'Income').reduce((s, c) => s + (c.amount || 0), 0);
    const totalExp = txs.filter((t) => t.voucher_type === 'Expense').reduce((s, c) => s + (c.amount || 0), 0);
    const netProfit = totalInc - totalExp;
    const rows = [
      { sr: 1, id: 'pl-1', type: 'Revenue', classification: 'Tuition & Academic Income', amount: totalInc, share: '100%' },
      { sr: 2, id: 'pl-2', type: 'Expense', classification: 'Operating & Admin Expenses', amount: totalExp, share: totalInc > 0 ? `${Math.round((totalExp / totalInc) * 100)}%` : '0%' },
      { sr: 3, id: 'pl-3', type: 'Net Profit', classification: 'Net Surplus / Deficit', amount: netProfit, share: totalInc > 0 ? `${Math.round((netProfit / totalInc) * 100)}%` : '0%' }
    ];
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'type', label: 'Type', visible: true },
      { key: 'classification', label: 'Account Classification', visible: true },
      { key: 'amount', label: 'Period Amount (PKR)', visible: true }, { key: 'share', label: 'Share %', visible: true }
    ];
    return { columns, rows };
  }

  const slips = await StaffSalarySlip.find(qBase).populate('staff_id', 'name employee_code').sort({ createdAt: -1 }).limit(100).lean();
  const rows = slips.map((s, i) => ({
    sr: i + 1, id: s._id, slip_no: s.slip_no, staff_name: s.staff_id?.name || '—',
    month: s.salary_month, gross: s.gross_salary, deductions: s.total_deductions,
    net: s.net_payable, loan_ded: s.loan_deduction || 0, status: s.status
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'slip_no', label: 'Slip #', visible: true },
    { key: 'staff_name', label: 'Staff Name', visible: true }, { key: 'month', label: 'Month', visible: true },
    { key: 'gross', label: 'Gross Salary', visible: true }, { key: 'deductions', label: 'Deductions', visible: true },
    { key: 'net', label: 'Net Paid', visible: true }, { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildAccountsReports };
