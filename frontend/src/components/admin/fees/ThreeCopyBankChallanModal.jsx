import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import BankChallanCopyItem from './BankChallanCopyItem';

const ThreeCopyBankChallanModal = ({ isOpen, onClose, invoices = [], bankSettings, schoolName }) => {
  const printRef = useRef(null);

  if (!isOpen || !invoices || invoices.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const copyTitles = bankSettings?.challan_copies || ['Bank Copy', 'Institute Copy', 'Student Copy'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[96vh] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 print:hidden">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Pakistani 3-Copy Bank Challan Studio ({invoices.length} Challan{invoices.length > 1 ? 's' : ''})
            </h3>
            <p className="text-[11px] text-slate-500">Official Landscape A4 3-Copy Voucher (Bank | Institute | Student)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Landscape</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-100 dark:bg-slate-950 print:p-0 print:space-y-0 print:bg-white">
          <style>{`
            @media print {
              @page { size: landscape; margin: 0; }
              body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .challan-page { page-break-after: always; break-after: page; height: 100vh; }
            }
          `}</style>

          {invoices.map((inv) => (
            <div key={inv._id} className="challan-page bg-white p-2 border border-slate-300 shadow-sm print:border-none print:shadow-none min-h-[500px] flex items-stretch gap-1">
              {copyTitles.map((title, idx) => (
                <React.Fragment key={title}>
                  <BankChallanCopyItem
                    copyTitle={title}
                    invoice={inv}
                    bankSettings={bankSettings}
                    schoolName={schoolName}
                  />
                  {idx < copyTitles.length - 1 && (
                    <div className="flex flex-col items-center justify-center px-1 text-slate-400 select-none">
                      <div className="w-[1px] flex-1 border-r border-dashed border-slate-400" />
                      <span className="text-[10px] my-1 font-mono">✂</span>
                      <div className="w-[1px] flex-1 border-r border-dashed border-slate-400" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeCopyBankChallanModal;
