import { Printer, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const FeeReceiptModal = ({ isOpen, onClose, payment }) => {
  const { user } = useAuth();
  if (!isOpen || !payment) return null;

  const student = payment.student_id || {};
  const campus = payment.campus_id || {};
  const schoolName = user?.school_name || 'Elite Educational System';
  const formattedDate = payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-good" />
            <span className="font-bold text-xs text-ink dark:text-ink-dark uppercase tracking-wider">Official Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-sm">
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-ink-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 printable-receipt text-ink dark:text-ink-dark text-xs">
          <div className="text-center pb-3 border-b border-dashed border-line">
            <h2 className="text-base font-black tracking-tight uppercase">{schoolName}</h2>
            <p className="text-[11px] text-ink-muted">{campus.name || 'Main Campus'} • Official Fee Collection Voucher</p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-secondary/40 border border-line text-[11px]">
            <div><span className="font-bold text-ink-muted">Receipt #:</span> <span className="font-mono font-bold text-primary">{payment.receipt_number}</span></div>
            <div><span className="font-bold text-ink-muted">Date:</span> <span>{formattedDate}</span></div>
            <div><span className="font-bold text-ink-muted">Student:</span> <span className="font-bold">{student.name}</span></div>
            <div><span className="font-bold text-ink-muted">GR #:</span> <span className="font-mono font-bold">{student.gr_number}</span></div>
            <div><span className="font-bold text-ink-muted">Month:</span> <span>{payment.fee_month}</span></div>
            <div><span className="font-bold text-ink-muted">Mode:</span> <span>{payment.payment_method}</span></div>
          </div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line">
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="py-2 px-3">Base Tuition & Charges</td>
                <td className="py-2 px-3 text-right font-mono">Rs. {Number(payment.base_fee || 0).toLocaleString()}</td>
              </tr>
              {Number(payment.discount || 0) > 0 && (
                <tr className="text-good">
                  <td className="py-1.5 px-3">- Concession / Waiver</td>
                  <td className="py-1.5 px-3 text-right font-mono">- Rs. {Number(payment.discount).toLocaleString()}</td>
                </tr>
              )}
              {Number(payment.fine || 0) > 0 && (
                <tr className="text-bad">
                  <td className="py-1.5 px-3">+ Late Fine</td>
                  <td className="py-1.5 px-3 text-right font-mono">+ Rs. {Number(payment.fine).toLocaleString()}</td>
                </tr>
              )}
              <tr className="bg-surface-secondary/40 font-bold">
                <td className="py-2.5 px-3 text-sm">Amount Paid</td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-good">Rs. {Number(payment.paid_amount || 0).toLocaleString()}</td>
              </tr>
              {Number(payment.balance_due || 0) > 0 && (
                <tr className="text-bad font-semibold">
                  <td className="py-1.5 px-3">Remaining Balance</td>
                  <td className="py-1.5 px-3 text-right font-mono">Rs. {Number(payment.balance_due).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pt-2 border-t border-line space-y-2">
            <OfficialSignatureStampBlock compact={true} signatureTitle="Cashier / Officer" stampTitle="Accounts Stamp" />
            <div className="flex items-center justify-between text-[9px] text-ink-muted font-mono pt-1">
              <span>Collector: {payment.collector_name || 'Accounts Staff'}</span>
              <span>EliteEdu Digital Voucher</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptModal;
