import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Family residential relocation',
  'Distance / Transport convenience',
  'Academic stream / program change',
  'Parent employment transfer',
  'Administrative branch adjustment'
];

const TransferReasonInput = ({ value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-ink dark:text-ink-dark">
          Reason for Relocation <span className="text-ink-muted text-[10px] font-normal">(Optional)</span>
        </label>
        <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3" /> Quick suggestions below
        </span>
      </div>

      <input
        type="text"
        list="transfer-reason-suggestions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Family residential relocation (or select below)"
        className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <datalist id="transfer-reason-suggestions">
        {SUGGESTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors border ${
              value === s
                ? 'bg-primary text-white border-primary shadow-2xs'
                : 'bg-surface-secondary/40 hover:bg-surface-secondary border-line dark:border-white/10 text-ink-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransferReasonInput;
