import { useState, useRef } from 'react';
import { X, Printer, ShoppingCart, Receipt } from 'lucide-react';
import StandardA4Receipt from './StandardA4Receipt';
import ThermalReceiptSlip from './ThermalReceiptSlip';

const PrintableReceiptModal = ({ sale, isOpen, onClose }) => {
  const [format, setFormat] = useState('thermal');
  const printRef = useRef(null);
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full ${format === 'thermal' ? 'max-w-md' : 'max-w-lg'} bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-all`}>
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Sales Receipt ({sale.receipt_no})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print {format === 'thermal' ? '80mm Slip' : 'A4 Receipt'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-secondary/50 border-b border-line print:hidden">
          <span className="text-[11px] font-bold text-ink-muted">Print Format:</span>
          <button
            onClick={() => setFormat('thermal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              format === 'thermal' ? 'bg-primary text-white shadow-xs' : 'bg-surface border border-line text-ink-muted hover:text-ink'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>80mm Thermal Roll</span>
          </button>
          <button
            onClick={() => setFormat('a4')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              format === 'a4' ? 'bg-primary text-white shadow-xs' : 'bg-surface border border-line text-ink-muted hover:text-ink'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Standard A4</span>
          </button>
        </div>

        <div ref={printRef} className="p-6 overflow-y-auto print:p-0">
          {format === 'thermal' ? (
            <ThermalReceiptSlip sale={sale} />
          ) : (
            <StandardA4Receipt sale={sale} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintableReceiptModal;
