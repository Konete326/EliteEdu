import { Bell, MessageSquare, Printer } from 'lucide-react';

const FeeDefaultersListTable = ({ defaulters = [], loading, onSendAlert, onOpenNotice }) => {
  const getWhatsAppUrl = (d) => {
    const phone = String(d.student?.contact_number || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Dear Parent of ${d.student?.name} (GR: ${d.student?.gr_number}),\nFee dues of PKR ${d.total_balance} are overdue. Please deposit promptly.\nAccounts Dept.`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface dark:bg-surface-dark">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line">
          <tr>
            <th className="py-2.5 px-3">Student & GR #</th>
            <th className="py-2.5 px-3">Father & Contact</th>
            <th className="py-2.5 px-3">Class</th>
            <th className="py-2.5 px-3 text-center">Unpaid Challans</th>
            <th className="py-2.5 px-3 text-right">Total Arrears</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {defaulters.length === 0 ? (
            <tr><td colSpan="6" className="py-8 text-center text-ink-muted">{loading ? 'Loading defaulters...' : 'No defaulters matching criteria.'}</td></tr>
          ) : (
            defaulters.map((d, i) => (
              <tr key={i} className="hover:bg-surface-secondary/30 transition-colors">
                <td className="py-2 px-3">
                  <div className="font-bold text-ink dark:text-ink-dark">{d.student?.name}</div>
                  <div className="text-[10px] text-ink-muted font-mono">GR: {d.student?.gr_number}</div>
                </td>
                <td className="py-2 px-3">
                  <div>{d.student?.father_name}</div>
                  <div className="text-[10px] text-ink-muted font-mono">{d.student?.contact_number || '—'}</div>
                </td>
                <td className="py-2 px-3">{d.grade?.name} ({d.section || 'A'})</td>
                <td className="py-2 px-3 text-center font-bold text-amber-600">{d.unpaid_invoices_count}</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-bad">PKR {Number(d.total_balance).toLocaleString()}</td>
                <td className="py-2 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button type="button" onClick={() => onSendAlert(d)} className="p-1.5 rounded-lg border border-line text-ink-muted hover:text-primary hover:bg-surface-secondary" title="Send Portal Alert">
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    {d.student?.contact_number && (
                      <a href={getWhatsAppUrl(d)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10" title="Send WhatsApp Reminder">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button type="button" onClick={() => onOpenNotice(d)} className="p-1.5 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10" title="Print Recovery Notice">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeDefaultersListTable;
