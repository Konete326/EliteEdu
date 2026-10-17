import { useState } from 'react';
import { Eye, Trash2, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import usePermissions from '../../../hooks/usePermissions';

const FeeHistoryTable = ({ payments, loading, onViewReceipt, onDeletePayment, search, onSearchChange }) => {
  const { canDelete } = usePermissions();
  const hasDeletePermission = canDelete('fees');

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-sm overflow-hidden">
      <div className="p-4 border-b border-line dark:border-line-dark flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Recent Transactions & Receipts</h3>
          <p className="text-[11px] text-ink-muted">Historical fee collection audit log</p>
        </div>
        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search receipt, student, GR..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-ink-muted text-[10px] font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="py-3 px-4">Receipt #</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Fee Month</th>
              <th className="py-3 px-4">Paid Amount</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark text-ink dark:text-ink-dark">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-ink-muted">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading transactions...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-ink-muted">
                  No fee payment records found.
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const student = p.student_id || {};
                const dateStr = p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—';
                return (
                  <tr key={p._id} className="hover:bg-surface-secondary/30 dark:hover:bg-surface-secondary-dark/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{p.receipt_number}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold">{student.name || '—'}</p>
                      <p className="text-[10px] text-ink-muted font-mono">GR: {student.gr_number || '—'}</p>
                    </td>
                    <td className="py-3 px-4 font-medium">{p.fee_month}</td>
                    <td className="py-3 px-4 font-mono font-bold text-good">Rs. {Number(p.paid_amount || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium text-ink-muted">{p.payment_method}</td>
                    <td className="py-3 px-4 text-ink-muted">{dateStr}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Paid' ? 'bg-good/10 text-good border border-good/20' : 'bg-bad/10 text-bad border border-bad/20'
                      }`}>
                        {p.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(p)}
                          title="View & Print Receipt"
                          className="p-1.5 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {hasDeletePermission && (
                          <button
                            type="button"
                            onClick={() => onDeletePayment(p)}
                            title="Void Transaction"
                            className="p-1.5 rounded-xl hover:bg-bad/10 text-bad transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

export default FeeHistoryTable;
