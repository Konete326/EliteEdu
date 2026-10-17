import { AlertTriangle, CreditCard, Phone } from 'lucide-react';

const FeeDefaultersTable = ({ students, loading, onQuickCollect, feeMonth }) => {
  const defaulters = (students || []).filter((s) => s.payment_status !== 'Paid');

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-sm overflow-hidden">
      <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-bad" />
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark">
            Pending Fee Defaulters ({feeMonth})
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-bad/10 text-bad">
          {defaulters.length} Students Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-ink-muted text-[10px] font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">GR #</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Monthly Fee</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Net Due</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark text-ink dark:text-ink-dark">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-ink-muted">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading defaulters...
                </td>
              </tr>
            ) : defaulters.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-good font-medium">
                  All active students have cleared their fees for {feeMonth}!
                </td>
              </tr>
            ) : (
              defaulters.map((st) => (
                <tr key={st._id} className="hover:bg-surface-secondary/30 dark:hover:bg-surface-secondary-dark/20 transition-colors">
                  <td className="py-3 px-4 font-bold">{st.name}</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">{st.gr_number}</td>
                  <td className="py-3 px-4 font-medium">{st.current_grade?.name || 'Class'} ({st.current_section || 'A'})</td>
                  <td className="py-3 px-4 font-mono">Rs. {(st.base_fee || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-good">- Rs. {(st.discount || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-bad">Rs. {(st.net_payable || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-ink-muted flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{st.contact_number || '—'}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onQuickCollect(st)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Collect Fee</span>
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

export default FeeDefaultersTable;
