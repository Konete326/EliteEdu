import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const ThermalReceiptSlip = ({ sale }) => {
  return (
    <div className="w-full max-w-[300px] mx-auto p-3 font-mono text-[11px] leading-tight text-ink dark:text-ink-dark bg-surface dark:bg-surface-dark border-2 border-dashed border-line rounded-lg space-y-2 select-text">
      <div className="text-center pb-2 border-b border-dashed border-line space-y-0.5">
        <h2 className="text-xs font-black uppercase tracking-wider">ELITE EDUCATION SYSTEM</h2>
        <p className="text-[10px] text-ink-muted">Bookstore &amp; Uniforms POS</p>
        <p className="text-[9px] text-ink-muted">Receipt #: {sale.receipt_no}</p>
        <p className="text-[9px] text-ink-muted">{new Date(sale.createdAt).toLocaleString()}</p>
      </div>

      <div className="text-[10px] py-1 border-b border-dashed border-line space-y-0.5">
        <div><span className="text-ink-muted">Buyer:</span> <span className="font-bold">{sale.buyer_name}</span></div>
        <div><span className="text-ink-muted">Category:</span> {sale.buyer_type?.replace('_', ' ')}</div>
        <div><span className="text-ink-muted">Payment:</span> <span className="font-bold">{sale.payment_mode?.replace('_', ' ') || 'Cash'}</span></div>
      </div>

      <div className="py-1 border-b border-dashed border-line">
        <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-line/40">
          <span>ITEM / QTY</span>
          <span>TOTAL</span>
        </div>
        <div className="divide-y divide-dashed divide-line/30">
          {sale.items?.map((item, idx) => (
            <div key={idx} className="py-1">
              <div className="font-bold truncate">{item.name}</div>
              <div className="flex justify-between text-[10px] text-ink-muted">
                <span>{item.qty} x PKR {Number(item.unit_price).toLocaleString()}</span>
                <span className="font-bold text-ink">PKR {Number(item.line_total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 text-right text-[10px] pt-1 border-b border-dashed border-line">
        <div className="flex justify-between text-ink-muted"><span>Subtotal:</span><span>PKR {Number(sale.subtotal).toLocaleString()}</span></div>
        {Number(sale.discount || 0) > 0 && (
          <div className="flex justify-between text-rose-600"><span>Discount:</span><span>-PKR {Number(sale.discount).toLocaleString()}</span></div>
        )}
        <div className="flex justify-between font-black text-xs pt-1 border-t border-dashed border-line">
          <span>NET PAID:</span>
          <span>PKR {Number(sale.net_total).toLocaleString()}</span>
        </div>
      </div>

      <div className="py-1 text-center space-y-1">
        <div className="inline-block px-2 py-0.5 rounded bg-surface-secondary text-[8px] font-bold uppercase tracking-widest">
          PAID IN FULL
        </div>
        <p className="text-[8px] text-ink-muted">Exchange accepted within 3 days with receipt.</p>
      </div>

      <div className="scale-90 origin-top">
        <OfficialSignatureStampBlock signatureTitle="Store Cashier" stampTitle="Official Stamp" compact={true} />
      </div>

      <div className="pt-1 border-t border-dashed border-line text-right">
        <span className="text-[8px] font-black tracking-widest uppercase opacity-70 text-primary">EliteEdu</span>
      </div>
    </div>
  );
};

export default ThermalReceiptSlip;
