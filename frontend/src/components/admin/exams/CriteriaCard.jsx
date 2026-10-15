const CriteriaCard = ({ description, label, value, min = 0, max = 100, onChange }) => {
  return (
    <div className="p-4 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 dark:bg-[#121217] space-y-3">
      <p className="text-xs text-ink-sub dark:text-ink-sub-dark leading-relaxed min-h-[38px]">
        {description}
      </p>
      <label className="block text-[11px] font-bold text-ink-muted uppercase">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#16161d] text-ink dark:text-ink-dark outline-none focus:border-primary"
      />
    </div>
  );
};

export default CriteriaCard;
