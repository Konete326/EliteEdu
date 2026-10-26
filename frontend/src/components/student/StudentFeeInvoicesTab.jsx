const StudentFeeInvoicesTab = ({ invoices = [] }) => {
  let totalBilled = 0;
  let totalPaid = 0;

  invoices.forEach((inv) => {
    totalBilled += inv.net_amount || inv.total_amount || 0;
    totalPaid += inv.paid_amount || 0;
  });
  const totalDues = Math.max(0, totalBilled - totalPaid);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface dark:bg-surface-dark p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs">
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-semibold">Total Billed Fees</span>
          <h4 className="text-base sm:text-lg font-black text-ink dark:text-ink-dark mt-1">PKR {totalBilled.toLocaleString()}</h4>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs">
          <span className="text-xs text-good dark:text-good-dark font-semibold">Total Paid Amount</span>
          <h4 className="text-base sm:text-lg font-black text-good dark:text-good-dark mt-1">PKR {totalPaid.toLocaleString()}</h4>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs">
          <span className="text-xs text-bad dark:text-bad-dark font-semibold">Outstanding Balance</span>
          <h4 className={`text-base sm:text-lg font-black mt-1 ${totalDues > 0 ? 'text-bad dark:text-bad-dark' : 'text-good dark:text-good-dark'}`}>
            PKR {totalDues.toLocaleString()}
          </h4>
        </div>
      </div>

      <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-2xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[600px]">
          <thead className="bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark border-b border-line dark:border-line-dark font-bold text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-3">Challan / Invoice #</th>
              <th className="p-3">Month</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60">
            {invoices.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-xs text-ink-muted dark:text-ink-muted-dark">No fee invoices recorded.</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-surface-secondary/50 dark:hover:bg-surface-secondary-dark/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{inv.invoice_number || inv.challan_number || '—'}</td>
                  <td className="p-3 font-semibold text-ink dark:text-ink-dark">{inv.billing_month || 'Monthly'}</td>
                  <td className="p-3 text-ink-muted dark:text-ink-muted-dark">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-ink dark:text-ink-dark">PKR {(inv.net_amount || inv.total_amount || 0).toLocaleString()}</td>
                  <td className="p-3 font-semibold text-good dark:text-good-dark">PKR {(inv.paid_amount || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] border ${
                      inv.status === 'Paid'
                        ? 'bg-good-soft/70 text-good dark:text-good-dark border-good/20'
                        : 'bg-bad-soft/70 text-bad dark:text-bad-dark border-bad/20'
                    }`}>
                      {inv.status}
                    </span>
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

export default StudentFeeInvoicesTab;
