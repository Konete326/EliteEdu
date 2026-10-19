import { Landmark, ArrowDownRight, ArrowUpRight, Scale, Receipt } from 'lucide-react';

const TABS = [
  { id: 'chart', label: 'Chart of Accounts', icon: Landmark },
  { id: 'income', label: 'Income Register', icon: ArrowDownRight },
  { id: 'expenses', label: 'Expense Register', icon: ArrowUpRight },
  { id: 'transactions', label: 'Vouchers & Transactions', icon: Receipt },
  { id: 'statements', label: 'Balance Sheet & P&L', icon: Scale }
];

const AccountsHeader = ({ activeTab, onTabChange, summary = {} }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Accounts & Bookkeeping</h1>
            <p className="text-xs font-semibold text-ink-muted">Double-entry ledger, income/expense vouchers & financial statements</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Revenue</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">PKR {Number(summary.totalRevenue || 0).toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-rose-600 block">Total Expenses</span>
            <span className="font-black text-rose-700 dark:text-rose-400">PKR {Number(summary.totalExpenses || 0).toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-primary block">Net Profit</span>
            <span className={`font-black ${Number(summary.netProfit || 0) >= 0 ? 'text-primary' : 'text-rose-600'}`}>
              PKR {Number(summary.netProfit || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-surface-secondary/40 border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsHeader;
