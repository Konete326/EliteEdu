import { Printer, Trash2, ArrowRight, GraduationCap, Users } from 'lucide-react';

const TransferLedgerCard = ({ transfer: t, onPrint, onDelete }) => {
  const isStudent = t.entity_type === 'Student';

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
          {t.transfer_no}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
              isStudent
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
            }`}
          >
            {isStudent ? <GraduationCap size={12} /> : <Users size={12} />}
            <span>{t.entity_type}</span>
          </span>
          <span className="text-[10px] text-ink-muted font-mono">
            {t.transfer_date ? new Date(t.transfer_date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div>
        <p className="font-bold text-xs text-ink dark:text-white truncate">{t.person_name}</p>
        <p className="text-[10px] text-ink-muted font-mono">{t.identifier_code || 'N/A'} • {t.to_class_or_role || t.from_class_or_role || 'General'}</p>
      </div>

      <div className="flex items-center gap-1.5 font-semibold text-[11px] text-ink dark:text-white flex-wrap p-2.5 rounded-xl bg-surface-secondary/40">
        <span className="text-ink-muted truncate max-w-[120px]">{t.from_campus_name || 'Main Campus'}</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-primary font-bold truncate max-w-[120px]">{t.to_campus_name}</span>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-line/60 dark:border-line-dark/60">
        <button
          type="button"
          onClick={() => onPrint(t)}
          title="Print Official Order"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <Printer size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(t)}
          title="Delete Record"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TransferLedgerCard;
