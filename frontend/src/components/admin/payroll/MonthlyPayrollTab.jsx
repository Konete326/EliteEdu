import { useState } from 'react';
import { Search, Calculator, Calendar } from 'lucide-react';
import SalarySlipRow from './SalarySlipRow';

const MonthlyPayrollTab = ({ slips = [], currentMonth, onMonthChange, onGenerate, onEdit, onPay, onPrint, loading, generating }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = slips.filter((s) => {
    const staff = s.staff_id || {};
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchSearch = !search ||
      (staff.name && staff.name.toLowerCase().includes(search.toLowerCase())) ||
      (staff.employee_code && staff.employee_code.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface-secondary/40 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-transparent font-bold outline-none text-ink dark:text-ink-dark cursor-pointer"
            />
          </div>
          <button
            onClick={onGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{generating ? 'Calculating Attendance & Loans...' : 'Generate Monthly Payroll'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty name or code..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Payout</option>
            <option value="Paid">Disbursed (Paid)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Employee</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3 text-right">Basic (PKR)</th>
              <th className="py-2.5 px-3 text-right">Allowances</th>
              <th className="py-2.5 px-3 text-right">Deductions</th>
              <th className="py-2.5 px-3 text-right">Net Payable</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">Loading payroll slips...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">No salary slips generated for this month. Click "Generate Monthly Payroll" to compute.</td></tr>
            ) : (
              filtered.map((slip) => (
                <SalarySlipRow
                  key={slip._id}
                  slip={slip}
                  onEdit={onEdit}
                  onPay={onPay}
                  onPrint={onPrint}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyPayrollTab;
