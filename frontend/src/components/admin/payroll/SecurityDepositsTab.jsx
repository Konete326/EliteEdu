import { useState } from 'react';
import { Search, Plus, ShieldCheck, PauseCircle, PlayCircle } from 'lucide-react';

const SecurityDepositsTab = ({ deposits = [], onOpenNewDeposit, currentMonth, onToggleHold, loading }) => {
  const [search, setSearch] = useState('');
  const secDeposits = deposits.filter((l) => l.record_type === 'Security_Deposit');

  const filtered = secDeposits.filter((d) => {
    const staff = d.staff_id || {};
    return !search ||
      (staff.name && staff.name.toLowerCase().includes(search.toLowerCase())) ||
      (staff.employee_code && staff.employee_code.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search security deposits..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => onOpenNewDeposit('Security_Deposit')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Security Deposit Plan</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Faculty / Staff</th>
              <th className="py-2.5 px-3 text-right">Target Deposit (PKR)</th>
              <th className="py-2.5 px-3 text-right">Monthly Deduction</th>
              <th className="py-2.5 px-3 text-right">Accumulated</th>
              <th className="py-2.5 px-3 text-right">Pending Retention</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">{currentMonth} Retention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">Loading security deposits...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">No security deposit deductions registered.</td></tr>
            ) : (
              filtered.map((dep) => {
                const staff = dep.staff_id || {};
                const isHeld = (dep.hold_months || []).includes(currentMonth);
                return (
                  <tr key={dep._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-ink dark:text-ink-dark">{staff.name || 'Staff'}</div>
                      <div className="text-[10px] text-ink-muted">{staff.employee_code || ''} • {staff.designation || 'Faculty'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {Number(dep.principal_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600">
                      {Number(dep.monthly_installment || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                      {Number(dep.paid_Or_deducted_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-ink-muted">
                      {Number(dep.remaining_balance || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dep.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-secondary text-ink-muted'}`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {dep.status === 'Active' && (
                        <button
                          onClick={() => onToggleHold(dep._id, currentMonth)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isHeld
                              ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                          }`}
                        >
                          {isHeld ? <PauseCircle className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                          <span>{isHeld ? 'Held' : 'Deducting'}</span>
                        </button>
                      )}
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

export default SecurityDepositsTab;
