import { useState } from 'react';
import { Search, Printer, Edit2, Trash2 } from 'lucide-react';

const ExpenseRegisterTable = ({ transactions = [], onEdit, onDelete, onPrint, loading }) => {
  const [search, setSearch] = useState('');
  const expenseTxs = transactions.filter((t) => t.voucher_type === 'Expense');
  const filtered = expenseTxs.filter((t) => {
    return !search ||
      t.voucher_no.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.cost_center && t.cost_center.toLowerCase().includes(search.toLowerCase())) ||
      (t.account_head_name && t.account_head_name.toLowerCase().includes(search.toLowerCase()));
  });

  const totalAmount = filtered.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PV vouchers..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-rose-600 block">Filtered Total</span>
          <span className="font-black text-rose-700 dark:text-rose-400">PKR {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Voucher #</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Expense Head</th>
              <th className="py-2.5 px-3">Payee / Narration</th>
              <th className="py-2.5 px-3">Cost Center</th>
              <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">Loading expense vouchers...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">No expense vouchers recorded.</td></tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{tx.voucher_no}</td>
                  <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                    {new Date(tx.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-ink dark:text-ink-dark">{tx.account_head_name}</td>
                  <td className="py-2.5 px-3 max-w-[200px] truncate text-ink-muted">{tx.title}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary border border-line text-ink-muted">
                      {tx.cost_center || 'General'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-rose-600">
                    {Number(tx.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                    <button onClick={() => onPrint(tx)} title="Print Voucher" className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onEdit(tx)} title="Edit" className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(tx._id)} title="Delete" className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
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

export default ExpenseRegisterTable;
