import { useState } from 'react';
import { Search, Printer } from 'lucide-react';

const StoreSalesTable = ({ sales = [], onPrint, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = sales.filter((sale) => {
    return !search ||
      sale.receipt_no.toLowerCase().includes(search.toLowerCase()) ||
      sale.buyer_name.toLowerCase().includes(search.toLowerCase());
  });

  const totalRevenue = filtered.reduce((acc, s) => acc + Number(s.net_total || 0), 0);

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt # or customer..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">Filtered Total</span>
          <span className="font-black text-emerald-700 dark:text-emerald-400">PKR {totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Receipt #</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Customer / Student</th>
              <th className="py-2.5 px-3">Items Purchased</th>
              <th className="py-2.5 px-3">Mode</th>
              <th className="py-2.5 px-3 text-right">Net Total (PKR)</th>
              <th className="py-2.5 px-3 text-right">Print</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">Loading POS sales register...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">No sales recorded yet.</td></tr>
            ) : (
              filtered.map((sale) => (
                <tr key={sale._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{sale.receipt_no}</td>
                  <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-ink dark:text-ink-dark">{sale.buyer_name}</div>
                    <div className="text-[10px] text-ink-muted">{sale.buyer_type.replace('_', ' ')}</div>
                  </td>
                  <td className="py-2.5 px-3 max-w-[200px] truncate text-ink-muted">
                    {sale.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary border border-line text-ink-muted">
                      {sale.payment_mode || 'Cash'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-600">
                    {Number(sale.net_total || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onPrint(sale)}
                      className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreSalesTable;
