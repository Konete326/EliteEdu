import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
    <div className="w-full bg-surface dark:bg-surface-dark border border-line rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
        <div>
          <h3 className="text-base font-black text-ink dark:text-ink-dark">Branch Transfer Ledger</h3>
          <p className="text-xs text-ink-muted">Historical audit log of all inter-campus student & staff relocations across branches</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by TRF #, name, campus..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-line bg-surface-secondary/40 text-xs outline-none focus:border-primary w-56"
            />
          </div>

          <div className="flex items-center p-0.5 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line">
            {['All', 'Student', 'Staff'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${typeFilter === t ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/70 text-[10px] uppercase font-bold text-ink-muted border-b border-line">
            <tr>
              <th className="py-2.5 px-3">Order No</th>
              <th className="py-2.5 px-3">Person & Code</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Transfer Route</th>
              <th className="py-2.5 px-3">Class / Role</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-ink-muted">Loading branch transfer ledger...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-ink-muted">No branch transfer records found.</td></tr>
            ) : (
              paginated.map((t) => (
                <TransferLedgerRow key={t._id} transfer={t} onPrint={onPrint} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-ink-muted">
        <div>
          Showing {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} transfer records
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" disabled={page <= 1} onClick={() => setPage(1)} className="p-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors" title="First Page">
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors" title="Previous Page">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 py-1 text-xs font-bold text-ink dark:text-ink-dark">
            Page {page} of {totalPages}
          </span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors" title="Next Page">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="p-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer hover:bg-surface-secondary transition-colors" title="Last Page">
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferLedgerTable;
