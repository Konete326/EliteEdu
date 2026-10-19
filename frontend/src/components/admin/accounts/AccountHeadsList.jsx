import { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';

const CATEGORY_COLORS = {
  Asset: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Liability: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Equity: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  Income: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  Expense: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

const AccountHeadsList = ({ heads = [], onEdit, onDelete, loading }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = heads.filter((h) => {
    const matchCat = filterCategory === 'All' || h.category === filterCategory;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.code.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search heads by code or title..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', 'Asset', 'Liability', 'Equity', 'Income', 'Expense'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-ink text-surface dark:bg-surface-secondary dark:text-ink-dark shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-secondary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line dark:border-line-dark font-bold">
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Account Title</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Opening (PKR)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">Loading chart of accounts...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">No account heads found.</td></tr>
            ) : (
              filtered.map((head) => (
                <tr key={head._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-ink-muted">{head.code}</td>
                  <td className="py-2.5 px-3 font-bold text-ink dark:text-ink-dark">{head.name}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${CATEGORY_COLORS[head.category] || 'bg-surface-secondary text-ink-muted'}`}>
                      {head.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    {Number(head.opening_balance || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${head.status === 'Active' ? 'text-emerald-600 bg-emerald-500/10' : 'text-ink-muted bg-surface-secondary'}`}>
                      {head.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button onClick={() => onEdit(head)} className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(head._id)} className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10">
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

export default AccountHeadsList;
