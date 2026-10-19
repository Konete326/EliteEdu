const BehaviorDomainRatings = ({ title, traits, ratings, onChange }) => (
  <div>
    <span className="block text-[10px] font-bold text-ink-muted mb-1.5">{title}</span>
    <div className="grid grid-cols-5 gap-1.5 text-center">
      {traits.map((t) => (
        <div key={t} className="p-1.5 rounded-lg bg-surface-secondary/30 border border-line">
          <span className="text-[9px] uppercase font-bold text-ink-muted block truncate">{t.replace('_', ' ')}</span>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings[t]}
            onChange={(e) => onChange(t, Number(e.target.value))}
            className="w-full text-center font-bold text-xs bg-transparent outline-none"
          />
        </div>
      ))}
    </div>
  </div>
);

export default BehaviorDomainRatings;
