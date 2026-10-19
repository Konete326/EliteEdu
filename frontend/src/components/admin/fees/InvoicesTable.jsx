import { Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const InvoicesTable = ({
  invoices = [],
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onSelectInvoice,
  onPrintSingle,
  loading = false
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">Paid</span>;
      case 'Partial':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">Partial</span>;
      case 'Overdue':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 border border-red-500/30">Overdue</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-600 border border-slate-500/30">Unpaid</span>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line dark:border-line-dark">
          <tr>
            <th className="py-2.5 px-3 w-8">
              <input
                type="checkbox"
                checked={invoices.length > 0 && selectedIds.length === invoices.length}
                onChange={onSelectAll}
                className="rounded"
              />
            </th>
            <th className="py-2.5 px-3">Challan #</th>
            <th className="py-2.5 px-3">Student & GR #</th>
            <th className="py-2.5 px-3">Class</th>
            <th className="py-2.5 px-3">Month</th>
            <th className="py-2.5 px-3 text-right">Net Payable</th>
            <th className="py-2.5 px-3 text-right">Balance</th>
            <th className="py-2.5 px-3 text-center">Status</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="9" className="py-8 text-center text-ink-muted">
                {loading ? 'Loading fee invoices...' : 'No invoices found matching criteria.'}
              </td>
            </tr>
          ) : (
            invoices.map((inv) => {
              const student = inv.student_id || {};
              const isSelected = selectedIds.includes(inv._id);
              return (
                <tr key={inv._id} className={`hover:bg-surface-secondary/40 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(inv._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-primary">{inv.challan_no}</td>
                  <td className="py-2 px-3">
                    <div className="font-bold text-ink dark:text-ink-dark">{student.name || '—'}</div>
                    <div className="text-[10px] text-ink-muted font-mono">GR: {student.gr_number || '—'}</div>
                  </td>
                  <td className="py-2 px-3">{inv.grade_id?.name || '—'} ({inv.section || 'A'})</td>
                  <td className="py-2 px-3 font-mono">{inv.billing_month}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">Rs. {Number(inv.net_payable).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-bad">Rs. {Number(inv.balance_due).toLocaleString()}</td>
                  <td className="py-2 px-3 text-center">{getStatusBadge(inv.status)}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPrintSingle(inv)}
                        className="p-1.5 rounded-lg border border-line text-ink-muted hover:text-primary hover:bg-surface-secondary"
                        title="Print 3-Copy Bank Challan"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => onSelectInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          Collect
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
  );
};

export default InvoicesTable;
