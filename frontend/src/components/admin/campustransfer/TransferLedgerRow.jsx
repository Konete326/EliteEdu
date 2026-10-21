import { Printer, Trash2, ArrowRight, GraduationCap, Users } from 'lucide-react';

const TransferLedgerRow = ({ transfer: t, onPrint, onDelete }) => {
  const isStudent = t.entity_type === 'Student';

  return (
    <tr className="hover:bg-surface-secondary/50 dark:hover:bg-white/5 transition-colors">
      <td className="py-3 px-3.5 font-mono font-bold text-xs text-primary whitespace-nowrap">
        {t.transfer_no}
      </td>
      <td className="py-3 px-3.5">
        <p className="font-bold text-xs text-ink dark:text-white truncate max-w-[180px]">
          {t.person_name}
        </p>
        <p className="text-[10px] text-ink-muted font-mono">{t.identifier_code || 'N/A'}</p>
      </td>
      <td className="py-3 px-3.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
            isStudent
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
          }`}
        >
          {isStudent ? <GraduationCap size={11} /> : <Users size={11} />}
          <span>{t.entity_type}</span>
        </span>
      </td>
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-ink dark:text-white flex-wrap">
          <span className="text-ink-muted truncate max-w-[120px]">{t.from_campus_name || 'Main Campus'}</span>
          <ArrowRight className="w-3 h-3 text-primary shrink-0" />
          <span className="text-primary font-bold truncate max-w-[120px]">{t.to_campus_name}</span>
        </div>
      </td>
      <td className="py-3 px-3.5 text-ink-muted text-xs whitespace-nowrap">
        {t.to_class_or_role || t.from_class_or_role || 'General'}
      </td>
      <td className="py-3 px-3.5 text-ink-muted text-[11px] font-mono whitespace-nowrap">
        {t.transfer_date ? new Date(t.transfer_date).toLocaleDateString() : 'N/A'}
      </td>
      <td className="py-3 px-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onPrint(t)}
            title="Print Official Order / NOC"
            className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Printer size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(t)}
            title="Delete Record"
            className="p-1.5 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransferLedgerRow;
