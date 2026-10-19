import { ShoppingCart, Package, Receipt, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const TABS = [
  { id: 'pos', label: '1. POS Checkout Terminal', icon: ShoppingCart },
  { id: 'inventory', label: '2. Inventory & Stock Manager', icon: Package },
  { id: 'sales', label: '3. Sales History & Receipts', icon: Receipt }
];

const StoreHeader = ({ activeTab, onTabChange, stats = {} }) => {
  return (
    <div className="space-y-4">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Campus Bookstore & POS Terminal</h1>
            <p className="text-xs font-semibold text-ink-muted">Uniforms, books, stationery counter sales, barcode scanning & live stock management</p>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Today&apos;s Store Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 font-mono">
            PKR {Number(stats.todaySalesAmount || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Live daily POS cash &amp; challan sales</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Monthly Store Revenue</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-black text-ink dark:text-ink-dark font-mono">
            PKR {Number(stats.monthSalesAmount || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Current calendar month total</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Total Inventory Items</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-black text-ink dark:text-ink-dark font-mono">
            {stats.totalItems || 0}
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Active catalog SKUs in stock</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Low Stock Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${Number(stats.lowStockCount || 0) > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`mt-2 text-xl font-black font-mono ${Number(stats.lowStockCount || 0) > 0 ? 'text-amber-600' : 'text-ink dark:text-ink-dark'}`}>
            {stats.lowStockCount || 0}
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Items below minimum reorder alert</p>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
