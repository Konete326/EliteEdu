import { useRef } from 'react';
import { X, Printer, Landmark } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableVoucherModal = ({ voucher, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const isIncome = voucher.voucher_type === 'Income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Print Official Voucher ({voucher.voucher_no})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-6 text-ink dark:text-ink-dark">
          <div className="flex items-start justify-between border-b-2 border-line pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-ink">ELITE EDUCATION SYSTEM</h1>
              <p className="text-xs font-semibold text-ink-muted">Official Financial Accounts & Bookkeeping Department</p>
              <p className="text-[10px] text-ink-muted">Main Campus • Accounts Office</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${isIncome ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-700 border border-rose-500/30'}`}>
                {isIncome ? 'Receipt Voucher (RV)' : 'Payment Voucher (PV)'}
              </span>
              <p className="font-mono text-sm font-bold mt-1.5">{voucher.voucher_no}</p>
              <p className="text-xs text-ink-muted">Date: {new Date(voucher.transaction_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-surface-secondary/40 p-4 rounded-xl border border-line">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Account Head</span>
              <span className="font-bold text-ink text-sm">{voucher.account_head_name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Payment Method</span>
              <span className="font-semibold text-ink">{voucher.payment_mode || 'Cash'} {voucher.reference_no ? `(Ref: ${voucher.reference_no})` : ''}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Title / Narration</span>
              <span className="font-semibold text-ink">{voucher.title}</span>
            </div>
            {voucher.cost_center && (
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-muted block">Cost Center</span>
                <span className="font-semibold text-ink">{voucher.cost_center}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Approval Status</span>
              <span className="font-bold text-emerald-600">{voucher.approval_status}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border-2 border-dashed border-line flex items-center justify-between">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Total Voucher Amount</span>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-ink">PKR {Number(voucher.amount || 0).toLocaleString()}</span>
              <span className="text-[10px] block text-ink-muted uppercase">Pakistani Rupees</span>
            </div>
          </div>

          <div className="pt-6">
            <OfficialSignatureStampBlock
              signatureTitle="Authorized Accountant"
              stampTitle="Accounts Office Stamp"
            />
          </div>

          <div className="pt-4 border-t border-line text-center text-[10px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu Financial ERP • System Generated Voucher</span>
            <span>Printed on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableVoucherModal;
