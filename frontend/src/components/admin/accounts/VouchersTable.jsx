import { useState } from 'react';
import { Search, Printer, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const STATUS_CLASSES = {
  Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

const VouchersTable = ({ transactions = [], onStatusChange, onPrint, onDelete, loading }) => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    const matchType = typeFilter === 'All' || t.voucher_type === typeFilter;
    const matchStatus = statusFilter === 'All' || t.approval_status === statusFilter;
    const matchSearch = !search ||
      t.voucher_no.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.account_head_name && t.account_head_name.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search all vouchers..." className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
            <option value="All">All Types (RV/PV/JV)</option>
            <option value="Income">Receipt Vouchers (RV)</option>
            <option value="Expense">Payment Vouchers (PV)</option>
            <option value="Journal">Journal Vouchers (JV)</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Voucher #</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Head</th>
              <th className="py-2.5 px-3">Title / Narration</th>
              <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">Loading vouchers...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="8" className="py-8 text-center text-ink-muted">No vouchers match the criteria.</td></tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-ink dark:text-ink-dark">{tx.voucher_no}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tx.voucher_type === 'Income' ? 'text-emerald-600 bg-emerald-500/10' : tx.voucher_type === 'Expense' ? 'text-rose-600 bg-rose-500/10' : 'text-indigo-600 bg-indigo-500/10'}`}>
                      {tx.voucher_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-ink dark:text-ink-dark">{tx.account_head_name}</td>
                  <td className="py-2.5 px-3 max-w-[180px] truncate text-ink-muted">{tx.title}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black">{Number(tx.amount || 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CLASSES[tx.approval_status] || 'bg-surface-secondary text-ink-muted'}`}>
                      {tx.approval_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                    {tx.approval_status === 'Pending' && (
                      <>
                        <button onClick={() => onStatusChange(tx._id, 'Approved')} title="Approve" className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-500/10"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onStatusChange(tx._id, 'Rejected')} title="Reject" className="p-1 rounded-lg text-rose-600 hover:bg-rose-500/10"><XCircle className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                    <button onClick={() => onPrint(tx)} title="Print" className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10"><Printer className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(tx._id)} title="Delete" className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
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

export default VouchersTable;
