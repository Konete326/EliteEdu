import { Printer, CreditCard, Edit2 } from 'lucide-react';

const STATUS_CLASSES = {
  Paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
};

const SalarySlipRow = ({ slip, onEdit, onPay, onPrint }) => {
  const staff = slip.staff_id || {};
  const isPaid = slip.status === 'Paid';

  return (
    <tr className="hover:bg-surface-secondary/30 transition-colors">
      <td className="py-2.5 px-3">
        <div className="font-bold text-ink dark:text-ink-dark">{staff.name || 'Unnamed Staff'}</div>
        <div className="text-[10px] text-ink-muted">
          {staff.employee_code ? `${staff.employee_code} • ` : ''}{staff.designation || 'Faculty'}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">P:{slip.present_days || 0}</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600">A:{slip.absent_days || 0}</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">L:{slip.leave_days || 0}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-right font-mono font-semibold">
        {Number(slip.basic_salary || 0).toLocaleString()}
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-emerald-600">
        +{Number(slip.total_allowances || 0).toLocaleString()}
      </td>
      <td className="py-2.5 px-3 text-right font-mono text-rose-600">
        -{Number(slip.total_deductions || 0).toLocaleString()}
      </td>
      <td className="py-2.5 px-3 text-right font-mono font-black text-ink dark:text-ink-dark">
        {Number(slip.net_payable || 0).toLocaleString()}
      </td>
      <td className="py-2.5 px-3 text-center">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CLASSES[slip.status] || 'bg-surface-secondary text-ink-muted'}`}>
          {slip.status}
        </span>
      </td>
      <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
        {!isPaid && (
          <>
            <button
              onClick={() => onPay(slip)}
              title="Disburse / Pay"
              className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-sm"
            >
              <CreditCard className="w-3 h-3 inline mr-1" />
              Pay
            </button>
            <button
              onClick={() => onEdit(slip)}
              title="Adjust Salary / Allowances"
              className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <button
          onClick={() => onPrint(slip)}
          title="Print Payslip"
          className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

export default SalarySlipRow;
