import { useState, useEffect } from 'react';
import { DollarSign, Printer, HandCoins } from 'lucide-react';
import PrintablePayslipModal from '../../components/admin/payroll/PrintablePayslipModal';
import api from '../../services/api';

const TeacherSalaryPage = () => {
  const [slips, setSlips] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get('/payroll/my-slips'), api.get('/payroll/loans')])
      .then(([sRes, lRes]) => {
        setSlips(sRes.data?.data || []);
        setLoans(lRes.data?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEarned = slips.filter((s) => s.status === 'Paid').reduce((acc, s) => acc + Number(s.paid_amount || s.net_payable || 0), 0);
  const activeLoanBalance = loans.filter((l) => l.status === 'Active').reduce((acc, l) => acc + Number(l.remaining_balance || 0), 0);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">My Salary & Compensation</h1>
            <p className="text-xs font-semibold text-ink-muted">View monthly salary slips, earnings breakdown and active loan records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Disbursed</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">PKR {totalEarned.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Active Loans / Adv.</span>
            <span className="font-black text-amber-700 dark:text-amber-400">PKR {activeLoanBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <DollarSign className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black text-ink dark:text-ink-dark">Monthly Salary History</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3 text-right">Basic (PKR)</th>
                <th className="py-2.5 px-3 text-right">Allowances</th>
                <th className="py-2.5 px-3 text-right">Deductions</th>
                <th className="py-2.5 px-3 text-right">Net Salary</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
              {loading ? (
                <tr><td colSpan="8" className="py-8 text-center text-ink-muted">Loading salary records...</td></tr>
              ) : slips.length === 0 ? (
                <tr><td colSpan="8" className="py-8 text-center text-ink-muted">No salary slips found on record.</td></tr>
              ) : (
                slips.map((slip) => (
                  <tr key={slip._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-ink dark:text-ink-dark">{slip.salary_month}</td>
                    <td className="py-2.5 px-3 text-[10px] text-ink-muted">P:{slip.present_days || 0} A:{slip.absent_days || 0} L:{slip.leave_days || 0}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{Number(slip.basic_salary || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600">+{Number(slip.total_allowances || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600">-{Number(slip.total_deductions || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-ink dark:text-ink-dark">{Number(slip.net_payable || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${slip.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button onClick={() => setSelectedSlip(slip)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20">
                        <Printer className="w-3 h-3" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrintablePayslipModal slip={selectedSlip} isOpen={Boolean(selectedSlip)} onClose={() => setSelectedSlip(null)} />
    </div>
  );
};

export default TeacherSalaryPage;
