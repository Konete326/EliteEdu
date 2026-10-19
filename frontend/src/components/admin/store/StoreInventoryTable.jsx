import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

const StoreInventoryTable = ({ items = [], onEdit, onDelete, onAddNew, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    return !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Stock</th>
              <th className="py-2.5 px-3 text-right">Cost (PKR)</th>
              <th className="py-2.5 px-3 text-right">Price (PKR)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">Loading stock ledger...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">No products found in inventory.</td></tr>
            ) : (
              filtered.map((item) => {
                const isOutOfStock = item.stock_qty <= 0;
                const isLow = item.stock_qty > 0 && item.stock_qty <= (item.min_stock_alert || 10);
                return (
                  <tr key={item._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-ink-muted">{item.sku}</td>
                    <td className="py-2.5 px-3 font-bold text-ink dark:text-ink-dark">{item.name}</td>
                    <td className="py-2.5 px-3 text-ink-muted">{item.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span className={isOutOfStock ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-ink'}>
                        {item.stock_qty}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-ink-muted">{Number(item.cost_price || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{Number(item.sale_price).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOutOfStock ? 'bg-rose-500/10 text-rose-600' : isLow ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                      <button onClick={() => onEdit(item)} className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDelete(item._id)} className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreInventoryTable;
