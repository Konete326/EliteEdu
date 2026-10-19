import { useRef } from 'react';
import { X, Printer, Scale } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableFinancialStatementModal = ({ data, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !data) return null;

  const { incomeStatement = {}, cashbook = {}, balanceSheet = {} } = data;
  const incomeBreakdown = incomeStatement.incomeBreakdown || {};
  const expenseBreakdown = incomeStatement.expenseBreakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Financial Statement & Profit & Loss Statement
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-6 text-ink dark:text-ink-dark text-xs">
          <div className="flex items-start justify-between border-b-2 border-line pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight">ELITE EDUCATION SYSTEM</h1>
              <p className="font-semibold text-ink-muted">Official Statement of Comprehensive Financial Performance & P&L</p>
              <p className="text-[10px] text-ink-muted">Period: As of {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Official Audit Report
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-emerald-600 uppercase text-[11px] tracking-wider border-b border-line pb-1">
                Income & Revenue (PKR)
              </h4>
              <div className="space-y-1.5 font-medium">
                {Object.entries(incomeBreakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-ink-muted">{k}</span>
                    <span className="font-mono font-bold text-emerald-600">{Number(v).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-line font-bold">
                <span>Total Revenue:</span>
                <span className="font-mono text-emerald-600 text-sm">PKR {Number(incomeStatement.totalRevenue || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-rose-600 uppercase text-[11px] tracking-wider border-b border-line pb-1">
                Operating Expenses (PKR)
              </h4>
              <div className="space-y-1.5 font-medium">
                {Object.entries(expenseBreakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-ink-muted">{k}</span>
                    <span className="font-mono font-bold text-rose-600">{Number(v).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-line font-bold">
                <span>Total Expenses:</span>
                <span className="font-mono text-rose-600 text-sm">PKR {Number(incomeStatement.totalExpenses || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-line flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Net Surplus / (Deficit)</span>
              <span className={`text-xl font-black font-mono ${Number(incomeStatement.netProfit || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                PKR {Number(incomeStatement.netProfit || 0).toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Liquid Assets (Cashbook)</span>
              <span className="text-sm font-black font-mono text-primary">
                Cash: {Number(cashbook.cashInHand || 0).toLocaleString()} | Bank: {Number(cashbook.bankBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <OfficialSignatureStampBlock
              signatureTitle="Chief Financial Officer / Auditor"
              stampTitle="Institutional Accounts Seal"
            />
          </div>

          <div className="pt-4 border-t border-line text-center text-[10px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu Financial ERP • Confidential Financial Document</span>
            <span>Generated on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableFinancialStatementModal;
