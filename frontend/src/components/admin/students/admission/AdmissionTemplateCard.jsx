import { CheckCircle2, Copy, Edit3, Trash2, FileText, Clock } from 'lucide-react';

const AdmissionTemplateCard = ({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  canDelete
}) => {
  const primaryColor = template.stripe_primary_color || '#581c87';
  const accentColor = template.stripe_accent_color || '#0f766e';
  const conditionsCount = (template.conditions?.length || 0) + (template.sub_clauses_revocation?.length || 0);

  return (
    <div
      className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between gap-4 group ${
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-2 ring-primary/20'
          : 'border-line dark:border-white/10 bg-surface dark:bg-[#121217] hover:border-primary/50 shadow-xs'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink dark:text-white truncate">
                {template.title}
              </h3>
              {template.is_default && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-primary/15 text-primary border border-primary/25">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Default
                </span>
              )}
            </div>
            <p className="text-[11px] text-ink-muted truncate mt-0.5">
              {template.header_office_title || 'Office of the Principal'}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-surface-secondary dark:bg-white/5 text-ink-muted shrink-0">
            <Clock className="w-3 h-3" />
            <span>{template.fee_due_days || 14}d Deadline</span>
          </div>
        </div>

        <div
          onClick={() => onSelect(template)}
          className="relative bg-white text-black rounded-xl p-3 border border-black/10 shadow-inner cursor-pointer hover:shadow-md transition-shadow overflow-hidden select-none"
        >
          <div className="absolute left-2.5 top-2.5 bottom-2.5 flex gap-1 pointer-events-none">
            <div style={{ backgroundColor: primaryColor }} className="w-1 h-full rounded-full" />
            <div style={{ backgroundColor: accentColor }} className="w-1 h-full rounded-full" />
          </div>

          <div className="pl-4 space-y-1.5 text-[9px]">
            <div className="border-b border-black/30 pb-1 flex items-center justify-between">
              <div className="w-20 h-1.5 bg-black/40 rounded" />
              <div className="w-12 h-1.5 bg-black/20 rounded" />
            </div>
            <div className="w-3/4 h-2 bg-black/70 rounded mx-auto" />
            <div className="space-y-1 pt-1 opacity-70">
              <div className="w-full h-1 bg-black/20 rounded" />
              <div className="w-5/6 h-1 bg-black/20 rounded" />
              <div className="w-4/5 h-1 bg-black/20 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-black/20 text-[8px] font-bold">
              <span className="text-black/60 truncate max-w-[120px]">
                {template.signatory_title || 'Principal'}
              </span>
              <div className="w-4 h-4 bg-black/80 rounded flex items-center justify-center text-[6px] text-white font-mono">
                QR
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span className="flex items-center gap-1 font-medium">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {conditionsCount} Configured Clauses
          </span>
          <span className="text-[10px] uppercase font-mono">
            {template.campus_id?.name || 'All Branches'}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-line/60 dark:border-white/5 flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={() => onSelect(template)}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSelected
              ? 'bg-primary text-white shadow-xs'
              : 'border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white'
          }`}
        >
          {isSelected ? 'Currently Applied' : 'Use Letter'}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(template)}
            title="Edit Letter Policy Rules"
            className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(template)}
            title="Duplicate as New Template"
            className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(template)}
              title="Delete Template"
              className="p-1.5 rounded-lg border border-bad/30 hover:bg-bad-soft text-bad transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionTemplateCard;
