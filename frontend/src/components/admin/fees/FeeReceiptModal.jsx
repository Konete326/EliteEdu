import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const FeeReceiptModal = ({ isOpen, onClose, payment }) => {
  const { user } = useAuth();
  if (!isOpen || !payment) return null;

  const student = payment.student_id || {};
  const campus = payment.campus_id || {};
  const schoolName = user?.school_name || 'Elite Educational System';
  const schoolLogo = user?.school_logo || '/logo.png';
  const formattedDate = payment.payment_date
    ? new Date(payment.payment_date).toLocaleDateString('en-US', { dateStyle: 'medium' })
    : new Date().toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-good" />
            <span className="font-bold text-sm text-ink dark:text-ink-dark">Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 printable-receipt text-ink dark:text-ink-dark">
          <div className="text-center pb-4 border-b border-dashed border-line dark:border-line-dark">
            <div className="flex items-center justify-center gap-3">
              <img src={schoolLogo} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
              <div className="text-left">
                <h2 className="text-base font-black tracking-tight">{schoolName}</h2>
                <p className="text-[11px] text-ink-muted">{campus.name || 'Main Campus'} • Official Fee Voucher</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/40 border border-line dark:border-line-dark text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-ink-muted">Receipt Number</p>
              <p className="font-mono font-bold text-sm text-primary">{payment.receipt_number}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-ink-muted">Payment Date</p>
              <p className="font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-ink-muted">Student Name</p>
              <p className="font-bold text-sm">{student.name || '—'}</p>
              <p className="text-[11px] text-ink-muted font-mono">GR: {student.gr_number || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-ink-muted">Father / Guardian</p>
              <p className="font-semibold">{student.father_name || '—'}</p>
              <p className="text-[11px] text-ink-muted">Class & Section: {student.current_section || 'A'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-line dark:border-line-dark overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-surface-secondary dark:bg-surface-secondary-dark/60 text-ink-muted text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-4 text-left">Fee Particulars</th>
                  <th className="py-2.5 px-4 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                <tr>
                  <td className="py-2.5 px-4">Tuition Fee ({payment.fee_month})</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold">Rs. {Number(payment.base_fee || 0).toLocaleString()}</td>
                </tr>
                {Number(payment.discount || 0) > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-good">Institutional Concession / Discount</td>
                    <td className="py-2 px-4 text-right font-mono text-good font-semibold">- Rs. {Number(payment.discount).toLocaleString()}</td>
                  </tr>
                )}
                {Number(payment.fine || 0) > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-bad">Late Fine / Arrears</td>
                    <td className="py-2 px-4 text-right font-mono text-bad font-semibold">+ Rs. {Number(payment.fine).toLocaleString()}</td>
                  </tr>
                )}
                {Number(payment.other_charges || 0) > 0 && (
                  <tr>
                    <td className="py-2 px-4">Auxiliary & Exam Charges</td>
                    <td className="py-2 px-4 text-right font-mono font-semibold">+ Rs. {Number(payment.other_charges).toLocaleString()}</td>
                  </tr>
                )}
                <tr className="bg-surface-secondary/30 dark:bg-surface-secondary-dark/20 font-bold">
                  <td className="py-3 px-4 text-sm">Total Paid Amount</td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-good">Rs. {Number(payment.paid_amount || 0).toLocaleString()}</td>
                </tr>
                {Number(payment.balance_due || 0) > 0 && (
                  <tr>
                    <td className="py-2 px-4 text-bad font-semibold">Remaining Balance Due</td>
                    <td className="py-2 px-4 text-right font-mono text-bad font-bold">Rs. {Number(payment.balance_due).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-line dark:border-line-dark text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-ink-muted">Mode of Payment</p>
              <p className="font-semibold text-primary">{payment.payment_method} {payment.reference_number ? `(${payment.reference_number})` : ''}</p>
              <p className="text-[10px] text-ink-muted mt-0.5">Collected By: {payment.collector_name || 'Accounts Staff'}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-good/10 text-good border border-good/20 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Payment</span>
              </div>
              <p className="text-[9px] text-ink-muted mt-1 font-mono">Digitally Recorded System Voucher</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptModal;
