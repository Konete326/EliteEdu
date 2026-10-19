import { useState, useEffect } from 'react';
import { CreditCard, Loader2, DollarSign, Receipt } from 'lucide-react';
import api from '../../../services/api';

const PosCollectionDock = ({ selectedInvoice, onCollectionSuccess, onClearSelection }) => {
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedInvoice) {
      setPaidAmount(String(selectedInvoice.balance_due || selectedInvoice.net_payable || 0));
      setError('');
    } else {
      setPaidAmount('');
    }
  }, [selectedInvoice]);

  if (!selectedInvoice) {
    return (
      <div className="p-6 rounded-2xl bg-surface border border-line text-center space-y-2 sticky top-4">
        <div className="w-10 h-10 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
        <h4 className="text-sm font-bold text-ink uppercase">POS Fee Collection Dock</h4>
        <p className="text-xs text-ink-muted">Select any challan or student from the left table to collect instant fee and print receipt.</p>
      </div>
    );
  }

  const student = selectedInvoice.student_id || {};
  const balance = Number(selectedInvoice.balance_due || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(paidAmount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post(`/fees/invoices/${selectedInvoice._id}/collect`, {
        paid_amount: amountNum, payment_method: paymentMethod, transaction_ref: transactionRef, notes
      });
      if (res.data?.success) onCollectionSuccess(res.data.payment, res.data.invoice);
    } catch (err) {
      setError(err.response?.data?.message || 'Collection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border-2 border-primary/40 shadow-md space-y-3 sticky top-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/10 text-primary"><DollarSign className="w-4 h-4" /></div>
          <div><h4 className="font-bold text-ink uppercase text-xs">POS Terminal</h4><span className="font-mono text-[10px] text-ink-muted">{selectedInvoice.challan_no}</span></div>
        </div>
        <button type="button" onClick={onClearSelection} className="text-[11px] font-bold text-ink-muted hover:text-bad">Cancel</button>
      </div>

      {error && <div className="p-2 rounded-xl bg-bad/10 text-bad text-[11px]">{error}</div>}

      <div className="p-2 rounded-xl bg-surface-secondary/40 border border-line space-y-1 text-[11px]">
        <div className="font-bold text-ink flex justify-between"><span className="uppercase">{student.name}</span><span className="font-mono text-primary">GR: {student.gr_number}</span></div>
        <div className="text-ink-muted">Class: {selectedInvoice.grade_id?.name || '—'} | Month: {selectedInvoice.billing_month}</div>
        <div className="flex justify-between font-bold pt-1 border-t border-line/40"><span>Net: PKR {Number(selectedInvoice.net_payable).toLocaleString()}</span><span className="text-bad">Due: PKR {balance.toLocaleString()}</span></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <div className="flex justify-between mb-1"><label className="font-bold text-ink">Collecting Amount (PKR) *</label><button type="button" onClick={() => setPaidAmount(String(balance))} className="text-[10px] font-bold text-primary hover:underline">Pay Full</button></div>
          <input type="number" min="1" max={balance} required value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-mono font-bold text-sm outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-bold text-ink mb-1 block">Mode</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
              <option value="Cash">Cash</option><option value="Bank Deposit">Bank Deposit</option><option value="Online Transfer">Online Transfer</option><option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-ink mb-1 block">Txn Ref</label>
            <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="Ref #" className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
          <span>✓ Collect & Print Receipt</span>
        </button>
      </form>
    </div>
  );
};

export default PosCollectionDock;
