import { Printer, Trash2, ArrowRight } from 'lucide-react';

const TransferLedgerRow = ({ transfer: t, onPrint, onDelete }) => {
  return (
    <tr className="hover:bg-surface-secondary/30 transition-colors">
      <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-primary">{t.transfer_no}</td>
      <td className="py-2.5 px-3">
        <p className="font-bold text-ink dark:text-ink-dark">{t.person_name}</p>
        <p className="text-[10px] text-ink-muted font-mono">{t.identifier_code || 'N/A'}</p>
      </td>
      <td className="py-2.5 px-3">
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${t.entity_type === 'Student' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'}`}>
          {t.entity_type}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5 font-semibold text-[11px]">
          <span>{t.from_campus_name || 'Main'}</span>
          <ArrowRight className="w-3 h-3 text-ink-muted" />
          <span className="text-primary">{t.to_campus_name}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-ink-muted text-[11px]">{t.to_class_or_role || t.from_class_or_role || 'General'}</td>
      <td className="py-2.5 px-3 text-ink-muted text-[10px]">{t.transfer_date ? new Date(t.transfer_date).toLocaleDateString() : 'N/A'}</td>
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onPrint(t)}
            title="Print Transfer Order / NOC"
            className="p-1.5 rounded-lg border border-line hover:border-primary/40 text-ink-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(t)}
            title="Delete Record"
            className="p-1.5 rounded-lg border border-line hover:border-rose-500/40 text-ink-muted hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransferLedgerRow;
