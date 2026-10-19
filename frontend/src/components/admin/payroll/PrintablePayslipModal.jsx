import { useRef } from 'react';
import { X, Printer, DollarSign } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintablePayslipModal = ({ slip, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !slip) return null;

  const staff = slip.staff_id || {};
  const isPaid = slip.status === 'Paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Official Salary Payslip • {slip.salary_month}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-5 text-ink dark:text-ink-dark text-xs">
          <div className="flex items-start justify-between border-b-2 border-line pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-ink">ELITE EDUCATION SYSTEM</h1>
              <p className="font-semibold text-ink-muted">Human Resources & Payroll Disbursal Department</p>
              <p className="text-[10px] text-ink-muted">Employee Confidential Salary Statement</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${isPaid ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                {isPaid ? 'Salary Disbursed' : 'Payment Pending'}
              </span>
              <p className="font-bold text-sm mt-1">Month: {slip.salary_month}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-secondary/40 border border-line">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Employee Name</span>
              <span className="font-bold text-ink">{staff.name || 'Staff Member'}</span>
              <span className="text-[10px] text-ink-muted block">{staff.employee_code || ''} • {staff.designation || 'Faculty'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Department & Attendance</span>
              <span className="font-semibold text-ink">{staff.department || 'Academics'}</span>
              <span className="text-[10px] font-bold text-emerald-600 block">P: {slip.present_days || 0} | A: {slip.absent_days || 0} | L: {slip.leave_days || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider border-b border-line pb-1">Earnings (PKR)</h4>
              <div className="flex justify-between py-0.5"><span>Basic Salary:</span><span className="font-mono font-bold">{Number(slip.basic_salary || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>House Rent:</span><span className="font-mono">{Number(slip.house_rent_allowance || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Medical:</span><span className="font-mono">{Number(slip.medical_allowance || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Conveyance:</span><span className="font-mono">{Number(slip.conveyance_allowance || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Bonus / Extra:</span><span className="font-mono">{Number(slip.bonus_or_encashment || 0).toLocaleString()}</span></div>
              <div className="flex justify-between pt-1 border-t border-line font-bold"><span>Total Gross:</span><span className="font-mono text-emerald-600">PKR {(Number(slip.basic_salary || 0) + Number(slip.total_allowances || 0)).toLocaleString()}</span></div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-rose-600 uppercase text-[10px] tracking-wider border-b border-line pb-1">Deductions (PKR)</h4>
              <div className="flex justify-between py-0.5"><span>Absent Days:</span><span className="font-mono">{Number(slip.absent_deduction || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Loan / Advance:</span><span className="font-mono">{Number(slip.loan_deduction || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Security Deposit:</span><span className="font-mono">{Number(slip.deposit_deduction || 0).toLocaleString()}</span></div>
              <div className="flex justify-between py-0.5"><span>Other Penalties:</span><span className="font-mono">{Number(slip.other_deduction || 0).toLocaleString()}</span></div>
              <div className="flex justify-between pt-1 border-t border-line font-bold"><span>Total Deductions:</span><span className="font-mono text-rose-600">PKR {Number(slip.total_deductions || 0).toLocaleString()}</span></div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border-2 border-line flex items-center justify-between">
            <span className="font-bold text-ink-muted uppercase">Net Disbursable Salary</span>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-ink">PKR {Number(slip.net_payable || 0).toLocaleString()}</span>
              {isPaid && <span className="text-[10px] block text-emerald-600 font-bold">Paid via {slip.payment_mode || 'Bank'} on {new Date(slip.payment_date).toLocaleDateString()}</span>}
            </div>
          </div>

          <div className="pt-4">
            <OfficialSignatureStampBlock signatureTitle="HR & Payroll Officer" stampTitle="School Accounts Stamp" />
          </div>

          <div className="pt-3 border-t border-line text-center text-[10px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu HRMS • Computer Generated Payslip</span>
            <span>Printed on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintablePayslipModal;
