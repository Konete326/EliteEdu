import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const StandardA4Receipt = ({ sale }) => {
  return (
    <div className="relative space-y-4 text-ink dark:text-ink-dark text-xs select-text">
      <div className="text-center border-b-2 border-line pb-3">
        <h1 className="text-base font-black tracking-tight">ELITE EDUCATION SYSTEM</h1>
        <p className="font-semibold text-ink-muted text-[11px]">Official Bookstore &amp; Uniform Point of Sale</p>
        <div className="flex justify-between items-center text-[10px] text-ink-muted pt-2 font-mono">
          <span>Receipt: {sale.receipt_no}</span>
          <span>Date: {new Date(sale.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-surface-secondary/40 border border-line space-y-1">
        <div className="flex justify-between font-bold">
          <span className="text-ink-muted">Customer / Buyer:</span>
          <span>{sale.buyer_name} ({sale.buyer_type?.replace('_', ' ')})</span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-ink-muted">Payment Mode:</span>
          <span>{sale.payment_mode?.replace('_', ' ') || 'Cash'}</span>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line text-ink-muted font-bold text-[10px]">
            <th className="py-1.5">Item</th>
            <th className="py-1.5 text-center">Qty</th>
            <th className="py-1.5 text-right">Price</th>
            <th className="py-1.5 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/40">
          {sale.items?.map((item, idx) => (
            <tr key={idx} className="py-1">
              <td className="py-1 font-semibold">{item.name}</td>
              <td className="py-1 text-center font-mono">{item.qty}</td>
              <td className="py-1 text-right font-mono">{Number(item.unit_price).toLocaleString()}</td>
              <td className="py-1 text-right font-mono font-bold">{Number(item.line_total).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 pt-2 border-t-2 border-line text-right">
        <div className="flex justify-between text-ink-muted"><span>Subtotal:</span><span className="font-mono">PKR {Number(sale.subtotal).toLocaleString()}</span></div>
        {Number(sale.discount || 0) > 0 && (
          <div className="flex justify-between text-rose-600"><span>Discount:</span><span className="font-mono">-PKR {Number(sale.discount).toLocaleString()}</span></div>
        )}
        <div className="flex justify-between font-black text-sm pt-1 border-t border-line text-emerald-600">
          <span>Net Paid:</span>
          <span className="font-mono">PKR {Number(sale.net_total).toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-3">
        <OfficialSignatureStampBlock signatureTitle="Bookstore Cashier" stampTitle="Official Store Stamp" compact={true} />
      </div>

      <div className="pt-2 border-t border-line flex items-center justify-between text-[9px] text-ink-muted">
        <span>Goods once sold can be exchanged within 3 days.</span>
        <span className="font-black tracking-widest uppercase opacity-70 text-[10px] text-primary">EliteEdu</span>
      </div>
    </div>
  );
};

export default StandardA4Receipt;
