import { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import api from '../../../services/api';

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'Online / Portal'];

const PaySalarySlipModal = ({ slip, isOpen, onClose, onPaid }) => {
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [referenceNo, setReferenceNo] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slip) {
      setPaidAmount(slip.net_payable || 0);
      setReferenceNo('');
      setPaymentMode('Bank Transfer');
    }
  }, [slip]);

  if (!isOpen || !slip) return null;

  const staff = slip.staff_id || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/payroll/slips/${slip._id}/pay`, {
        payment_mode: paymentMode,
        reference_no: referenceNo,
        paid_amount: Number(paidAmount)
      });
      onPaid();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h3 className="text-sm font-black text-ink dark:text-ink-dark">
            Confirm Salary Payout Disbursal
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-line space-y-2">
            <div className="flex justify-between font-bold">
              <span className="text-ink-muted">Staff Member:</span>
              <span className="text-ink">{staff.name || 'Staff'}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-ink-muted">Month:</span>
              <span className="text-ink">{slip.salary_month}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-line">
              <span className="text-ink-muted">Net Disbursable:</span>
              <span className="font-mono text-emerald-600 text-sm">PKR {Number(slip.net_payable || 0).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Disbursal Amount (PKR)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-mono font-bold outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Payment Method</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
            >
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Bank Trx Ref / Cheque #</label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. FT-20261017-9821"
              className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{submitting ? 'Processing Payout...' : 'Disburse Salary Slip'}</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink font-bold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaySalarySlipModal;
