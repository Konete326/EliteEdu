import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeftRight, X } from 'lucide-react';
import TransferLedgerRow from './TransferLedgerRow';

const TransferLedgerTable = ({ transfers = [], loading, onPrint, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = transfers.filter((t) => {
    const matchesType = typeFilter === 'All' || t.entity_type === typeFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      t.transfer_no?.toLowerCase().includes(term) ||
      t.person_name?.toLowerCase().includes(term) ||
      t.identifier_code?.toLowerCase().includes(term) ||
      t.from_campus_name?.toLowerCase().includes(term) ||
      t.to_campus_name?.toLowerCase().includes(term);
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (val) => { setSearchTerm(val); setPage(1); };
  const handleType = (t) => { setTypeFilter(t); setPage(1); };

  return (
    <div className="w-full bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink dark:text-white">
            Branch Transfer Ledger
          </h3>
          <p className="text-xs text-ink-muted">
            Official chronological audit trail of all student and staff branch movements
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <Search size={14} className="text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, name, branch..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-7 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs text-ink dark:text-white outline-none focus:border-primary"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center p-1 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark shrink-0">
            {['All', 'Student', 'Staff'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleType(t)}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t === 'All' ? 'All Records' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-[10px] uppercase font-bold text-ink-muted border-b border-line dark:border-line-dark">
            <tr>
              <th className="py-2.5 px-3.5">Order No</th>
              <th className="py-2.5 px-3.5">Person & Code</th>
              <th className="py-2.5 px-3.5">Type</th>
              <th className="py-2.5 px-3.5">Transfer Route</th>
              <th className="py-2.5 px-3.5">Target Class / Role</th>
              <th className="py-2.5 px-3.5">Date</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-ink-muted">
                  Loading branch transfer ledger...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-ink-muted space-y-2">
                  <ArrowLeftRight className="w-8 h-8 mx-auto text-ink-muted" />
                  <p className="font-bold text-ink dark:text-white">No transfer records found</p>
                  <p className="text-[11px]">Click &quot;New Transfer&quot; to initiate a student or staff branch transfer.</p>
                </td>
              </tr>
            ) : (
              paginated.map((t) => (
                <TransferLedgerRow key={t._id} transfer={t} onPrint={onPrint} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-ink-muted">
        <div>
          Showing {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} transfer orders
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(1)}
            className="p-1.5 rounded-lg border border-line dark:border-line-dark disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors"
            title="First Page"
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 rounded-lg border border-line dark:border-line-dark disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 text-xs font-mono font-bold text-ink dark:text-white">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 rounded-lg border border-line dark:border-line-dark disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors"
            title="Next Page"
          >
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
            className="p-1.5 rounded-lg border border-line dark:border-line-dark disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors"
            title="Last Page"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferLedgerTable;
