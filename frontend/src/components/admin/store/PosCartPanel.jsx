import { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import PosBuyerSelector from './PosBuyerSelector';

const PAYMENT_MODES = [
  { id: 'Cash', label: 'Cash' },
  { id: 'Bank_Transfer', label: 'Bank Transfer' },
  { id: 'Add_To_Fee_Challan', label: 'Add to Student Fee Challan' }
];

const PosCartPanel = ({ cart = [], onUpdateQty, onRemove, onClear, onCheckout, submitting }) => {
  const [buyerType, setBuyerType] = useState('Student');
  const [buyerName, setBuyerName] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.sale_price) * Number(item.qty)), 0);
  const netTotal = Math.max(0, subtotal - Number(discount || 0));

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!cart.length || !buyerName) return;
    onCheckout({ buyerType, buyerName, studentId, staffId, discount: Number(discount), paymentMode, subtotal, netTotal });
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm flex flex-col justify-between space-y-4 sticky top-4">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase text-ink dark:text-ink-dark">Current POS Cart ({cart.length})</h3>
          </div>
          {cart.length > 0 && (
            <button onClick={onClear} className="text-[10px] font-bold text-rose-600 hover:underline">Clear All</button>
          )}
        </div>

        <PosBuyerSelector
          buyerType={buyerType} setBuyerType={setBuyerType} buyerName={buyerName}
          setBuyerName={setBuyerName} setStudentId={setStudentId} setStaffId={setStaffId}
        />

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="text-center text-xs text-ink-muted py-6">Cart is empty. Select items from the catalog.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/30 border border-line text-xs">
                <div className="max-w-[130px]">
                  <p className="font-bold text-ink truncate">{item.name}</p>
                  <p className="text-[10px] text-ink-muted font-mono">PKR {Number(item.sale_price).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-surface rounded-lg border border-line p-0.5">
                    <button onClick={() => onUpdateQty(item._id, item.qty - 1)} className="p-0.5 hover:bg-surface-secondary rounded"><Minus className="w-2.5 h-2.5" /></button>
                    <span className="font-mono font-bold text-xs px-1">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item._id, item.qty + 1)} className="p-0.5 hover:bg-surface-secondary rounded"><Plus className="w-2.5 h-2.5" /></button>
                  </div>
                  <button onClick={() => onRemove(item._id)} className="text-rose-600 hover:text-rose-700 p-1"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-line text-xs">
        <div className="flex justify-between text-ink-muted font-medium"><span>Subtotal:</span><span className="font-mono">PKR {subtotal.toLocaleString()}</span></div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-ink-muted">Discount (PKR):</span>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-24 text-right px-2 py-0.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-ink-muted">Payment Mode:</span>
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none text-xs">
            {PAYMENT_MODES.map((m) => (
              <option key={m.id} value={m.id} disabled={m.id === 'Add_To_Fee_Challan' && buyerType !== 'Student'}>
                {m.label} {m.id === 'Add_To_Fee_Challan' && buyerType !== 'Student' ? '(Students only)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-line font-bold">
          <span>Net Payable:</span>
          <span className="font-mono text-lg font-black text-emerald-600">PKR {netTotal.toLocaleString()}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!cart.length || !buyerName || submitting}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>{submitting ? 'Processing...' : '✓ Complete Sale & Print Receipt'}</span>
        </button>
      </div>
    </div>
  );
};

export default PosCartPanel;
