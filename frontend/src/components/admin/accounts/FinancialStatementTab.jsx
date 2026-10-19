import { Scale, Printer, ArrowDownRight, ArrowUpRight, Wallet, Landmark } from 'lucide-react';

const FinancialStatementTab = ({ data = {}, onPrint, loading }) => {
  const { incomeStatement = {}, cashbook = {} } = data;
  const incomeBreakdown = incomeStatement.incomeBreakdown || {};
  const expenseBreakdown = incomeStatement.expenseBreakdown || {};

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted">Total Revenue</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-600">
            PKR {Number(incomeStatement.totalRevenue || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted">Total Expenses</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black font-mono text-rose-600">
            PKR {Number(incomeStatement.totalExpenses || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted">Net Surplus / Profit</span>
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <p className={`text-xl font-black font-mono ${Number(incomeStatement.netProfit || 0) >= 0 ? 'text-primary' : 'text-rose-600'}`}>
            PKR {Number(incomeStatement.netProfit || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-ink-muted">Liquid Reserves</span>
            <Wallet className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-xl font-black font-mono text-cyan-700 dark:text-cyan-400">
            PKR {Number(cashbook.totalLiquid || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print Balance Sheet & P&L Statement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase text-ink dark:text-ink-dark">Income Sources Breakdown</h3>
          </div>
          <div className="divide-y divide-line dark:divide-line-dark text-xs font-medium">
            {Object.entries(incomeBreakdown).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2">
                <span className="text-ink-muted">{k}</span>
                <span className="font-mono font-bold text-emerald-600">PKR {Number(v).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-black uppercase text-ink dark:text-ink-dark">Expense Allocations Breakdown</h3>
          </div>
          <div className="divide-y divide-line dark:divide-line-dark text-xs font-medium">
            {Object.entries(expenseBreakdown).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2">
                <span className="text-ink-muted">{k}</span>
                <span className="font-mono font-bold text-rose-600">PKR {Number(v).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <Landmark className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black uppercase text-ink dark:text-ink-dark">Cashbook / Liquid Balances</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-line">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Cash in Hand (Safe)</span>
            <span className="text-lg font-black font-mono text-ink">PKR {Number(cashbook.cashInHand || 0).toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-line">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">School Bank Account</span>
            <span className="text-lg font-black font-mono text-ink">PKR {Number(cashbook.bankBalance || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatementTab;
