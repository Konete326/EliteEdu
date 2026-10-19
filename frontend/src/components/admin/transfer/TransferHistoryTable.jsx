import { useState } from 'react';
import { Search, Printer, ArrowRight, Trash2, Plus, ArrowLeftRight } from 'lucide-react';

const TransferHistoryTable = ({ transfers = [], onPrint, onDelete, onNewTransfer, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = transfers.filter((t) => {
    const s = t.student_id || {};
    const d = t.transfer_details || {};
    return !search ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (d.transfer_order_no && d.transfer_order_no.toLowerCase().includes(search.toLowerCase())) ||
      (d.reason && d.reason.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transfer orders..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#141414] font-semibold outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink-muted">{filtered.length} Recorded Transfers</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 dark:bg-white/5 text-ink-muted border-b border-line dark:border-white/10 font-bold">
              <th className="py-2.5 px-3">Order #</th>
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Campus Transfer Route</th>
              <th className="py-2.5 px-3">Effective</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Reason</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-white/5 font-medium">
            {loading ? (
              <tr><td colSpan="7" className="py-10 text-center text-ink-muted">Loading transfer records...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-ink-muted space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-ink dark:text-ink-dark">No campus transfers found</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    {search ? `No transfer orders match "${search}".` : 'No inter-campus transfers have been executed yet.'}
                  </p>
                  {onNewTransfer && !search && (
                    <button
                      type="button"
                      onClick={onNewTransfer}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Execute First Transfer</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const s = t.student_id || {};
                const d = t.transfer_details || {};
                return (
                  <tr key={t._id} className="hover:bg-surface-secondary/30 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{d.transfer_order_no || 'TRF-001'}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-ink dark:text-ink-dark">{s.name || 'Student'}</div>
                      <div className="text-[10px] text-ink-muted font-mono">{s.gr_number ? `GR: ${s.gr_number}` : s.roll_number ? `Roll: ${s.roll_number}` : ''}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-ink-muted">{d.from_campus_id?.name || 'Origin Campus'}</span>
                        <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                        <span className="text-ink dark:text-ink-dark">{d.to_campus_id?.name || 'Destination'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                      {d.effective_date ? new Date(d.effective_date).toLocaleDateString() : 'Immediate'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {t.status || 'Approved'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[150px] truncate text-ink-muted">{d.reason || 'Relocation'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPrint(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                          title="Print Order Slip"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Slip</span>
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(t)}
                            className="p-1.5 rounded-lg text-bad hover:bg-bad-soft/50 transition-colors"
                            title="Delete Transfer Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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

export default TransferHistoryTable;
